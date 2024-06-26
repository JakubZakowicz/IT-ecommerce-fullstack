import {
  Body,
  CacheKey,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  PaginationParams,
  Pagination,
} from '../decorators/pagination-params.decorator';
import { Sorting, SortingParams } from '../decorators/sorting-params.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @CacheKey('users')
  @Get()
  async findAll(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams([
      'id',
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'country',
      'city',
      'streetAddress',
      'postCode',
      'password',
      'created_at',
      'updated_at',
    ])
    sortingParams: Sorting,
  ) {
    return this.userService.findAll(paginationParams, sortingParams);
  }

  @UseGuards(JwtAuthGuard)
  @CacheKey('user')
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    return this.userService.update(id, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
