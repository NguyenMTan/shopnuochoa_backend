import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ParamPaginationDto } from './dto/param-pagination.dto';
import { User } from './model/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/decorator/role.enum';
import { RoleAuthGuard } from 'src/auth/guards/role-jwt.guard';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  // Tạo User
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  // Lấy tất cả
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Query() page: ParamPaginationDto) {
    const listUsers = await this.service.getAll(page);
    return this.buildPagination(listUsers, page);
  }

  // Lấy user theo Id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserById(@Param('id') _id: string) {
    return this.service.getOne(_id);
  }

  // Sửa User
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateUser(
    @Param('id') _id: string,
    @Body() updateUser: UpdateUserDto,
  ) {
    return this.service.updateUser(_id, updateUser);
  }

  // Sửa trạng thái User
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Put(':id/status')
  updateStatusUser(@Param('id') _id: string, @Query('status') status: boolean) {
    return this.service.updateStatusUser(_id, status);
  }

  // Xóa User
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') _id: string) {
    await this.service.deleteUser(_id);

    return 'Xoa user thanh cong';
  }

  private buildPagination(listUsers: User[], param: ParamPaginationDto) {
    const { page, limit } = param;
    return {
      total_items: listUsers.length,
      total_pages: Math.ceil(listUsers.length / limit),
      current_page: parseInt(String(page)),
      entities: listUsers,
    };
  }
}
