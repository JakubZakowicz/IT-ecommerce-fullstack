import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  readonly firstName: string;
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  readonly phoneNumber: string;
  readonly country: string;
  readonly city: string;
  readonly streetAddress: string;
  readonly postCode: string;
  readonly isConfirmed: boolean;
  readonly password: string;
}
