import { Model, Types } from 'mongoose';
import { Customer } from './model/customer.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private readonly model: Model<Customer>,
  ) {}

  async create(customer: CreateCustomerDto) {
    return await this.model.create({
      _id: new Types.ObjectId(),
      ...customer,
    });
  }

  async findByEmail(email: string) {
    return await this.model.findOne({ email: email }).lean<Customer>(true);
  }

  async findOne(id: string) {
    return await this.model.findOne({ _id: id }).lean<Customer>(true);
  }

  async findAll(
    page: number,
    limit: number,
    sort: 'asc' | 'desc',
    keyword: any,
  ) {
    return await this.model
      .find(
        keyword
          ? {
              $or: [
                { name: new RegExp(keyword, 'i') },
                { email: new RegExp(keyword, 'i') },
              ],
            }
          : {},
      )
      .skip((page - 1) * limit)
      .sort({ name: sort })
      .limit(limit)
      .lean<Customer[]>(true);
  }

  async updateOne(id: string, customerUpdate: UpdateCustomerDto) {
    return await this.model
      .findOneAndUpdate({ _id: id }, customerUpdate, { new: true })
      .lean<Customer>(true);
  }

  async updatePassword(id: string, password: string) {
    return await this.model
      .findOneAndUpdate({ _id: id }, { password }, { new: true })
      .lean<Customer>(true);
  }
}
