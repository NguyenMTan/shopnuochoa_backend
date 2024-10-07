import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerService } from './customer.service';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { buildPagination } from 'src/common/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { RoleAuthGuard } from 'src/auth/guards/role-jwt.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/decorator/role.enum';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('register')
  register(@Body() customer: CreateCustomerDto) {
    return this.customerService.create(customer);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    const { _id } = req.user;
    return this.customerService.findById(_id);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.customerService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  async getAll(@Query() params: ParamPaginationDto) {
    const customers = await this.customerService.findAll(params);

    return buildPagination(customers, params);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  update(@Request() req, @Body() customer: UpdateCustomerDto) {
    const { _id } = req.user;
    return this.customerService.updateById(_id, customer);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/change_password')
  updatePassword(@Request() req, @Body() password: ChangePasswordDto) {
    const { oldPassword, newPassword } = password;
    const { _id } = req.user;
    return this.customerService.updatePassword(_id, oldPassword, newPassword);
  }
}
