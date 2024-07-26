import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
import { User } from 'src/user/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      const passwordEquals = await argon2.verify(user.password, password);
      if (passwordEquals) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async signIn(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(email: string, password: string) {
    try {
      const userExists = !!(await this.userService.findOneByEmail(email));

      if (userExists) {
        throw new BadRequestException('Email already exists!');
      }

      const hashedPassword = await argon2.hash(password);

      const newUser = await this.userService.create({
        email,
        password: hashedPassword,
      });

      const verificationResult = await this.sendVerificationEmail(
        newUser.id,
        email,
      );

      return {
        message: 'User created successfully',
        verificationStatus: verificationResult.message,
      };
    } catch (error) {
      console.error('Error during sign up:', error);
      throw new InternalServerErrorException(
        'An error occurred during sign up',
      );
    }
  }

  private async sendVerificationEmail(id: string, email: string) {
    try {
      const token = await this.jwtService.signAsync(
        { userId: id },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '1d',
        },
      );

      const url = `${this.configService.get(
        'CORS_ORIGIN',
      )}/email-confirmation/${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirm Email',
        html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
      });
      return {
        message:
          'New account is created and verification email is sent successfully',
      };
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async verifyEmail(token: string) {
    try {
      const { userId } = await this.jwtService.verifyAsync(
        token,
        this.configService.get('JWT_SECRET'),
      );

      const user = await this.userService.findOneById(userId);

      if (!user) {
        throw new NotFoundException(`User not found!`);
      }

      if (user.isConfirmed) {
        return {
          message: 'Email address is already confirmed!',
        };
      }

      await this.userService.update(userId, { isConfirmed: true });

      return { message: 'Email confirmed successfully' };
    } catch (error) {
      console.log('Error verifying email', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      throw new InternalServerErrorException('Failed to verify email');
    }
  }

  async sendForgotPasswordEmail(email: string) {
    try {
      const user = await this.userService.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException('User with this email does not exist');
      }

      const token = await this.jwtService.signAsync(
        { email },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '1d',
        },
      );

      const url = `${this.configService.get(
        'CORS_ORIGIN',
      )}/forgot-password/${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset password',
        html: `Please click this link to reset your password: <a href="${url}">${url}</a>`,
      });
      return {
        message:
          'Reset password email is sent successfully. Please check your email',
      };
    } catch (error) {
      console.error('Error sending reset password email:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.code === 'EENVELOPE') {
        throw new BadRequestException('Invalid email address');
      }

      if (error.code === 'ETIMEDOUT') {
        throw new InternalServerErrorException(
          'Email service is unavailable. Please try again later.',
        );
      }

      throw new InternalServerErrorException(
        'Failed to send reset password email',
      );
    }
  }

  async resetPassword(resetPasswordData: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordData;

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.configService.get('JWT_SECRET'),
      );

      if (!payload || !payload.email) {
        throw new BadRequestException('Invalid or expired token');
      }

      const user = await this.userService.findOneByEmail(payload.email);

      if (!user) {
        throw new Error('Could not find user');
      }

      const isPasswordSame = await argon2.verify(user.password, newPassword);

      if (isPasswordSame) {
        throw new BadRequestException(
          'New password must be different from the current password',
        );
      }
      const hashedNewPassword = await argon2.hash(newPassword);

      await this.userService.update(user.id, { password: hashedNewPassword });

      return { message: 'Password changed successfully!' };
    } catch (error) {
      console.error('Error resetting password:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      throw new InternalServerErrorException('Failed to reset password');
    }
  }
}
