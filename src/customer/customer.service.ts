import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerRepository } from './customer.repository';
import * as bcrypt from 'bcrypt';

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
}
