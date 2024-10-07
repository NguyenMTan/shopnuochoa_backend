import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerRepository } from './customer.repository';
import * as bcrypt from 'bcrypt';
import { checkValisIsObject } from 'src/common/common';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  async create(customer: CreateCustomerDto) {
    customer.password = bcrypt.hashSync(customer.password, 10);
    try {
      return await this.repository.create(customer);
    } catch (error) {
      throw new UnprocessableEntityException('email đã tồn tại');
    }
  }

  async findById(id: string) {
    checkValisIsObject(id, 'customer id');
    const customer = await this.repository.findOne(id);
    if (!customer) {
      throw new NotFoundException('Không tìm thấy customer');
    }
    return customer;
  }

  findAll(params: ParamPaginationDto) {
    const { page, limit, sort, keyword } = params;

    const newSort = sort != 'asc' ? 'desc' : 'asc';

    return this.repository.findAll(page, limit, newSort, keyword);
  }

  async updateById(id: string, customerUpdate: UpdateCustomerDto) {
    checkValisIsObject(id, 'customer id');
    const customer = await this.repository.updateOne(id, customerUpdate);
    if (!customer) {
      throw new NotFoundException('Không tìm thấy customer');
    }

    return customer;
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string) {
    checkValisIsObject(id, 'id_customer');
    const customer = await this.repository.findOne(id);
    const isValid = await bcrypt.compareSync(oldPassword, customer.password);
    if (!isValid) {
      throw new NotFoundException('Mật khẩu cũ không đúng');
    }

    const hashNewPassowrd = bcrypt.hashSync(newPassword, 10);
    return this.repository.updatePassword(id, hashNewPassowrd);
  }
}
