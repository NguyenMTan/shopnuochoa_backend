import { CustomerRepository } from './customer.repository';
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { DatabaseModule } from 'src/database/database.module';
import { Customer, CustomerSchema } from './model/customer.schema';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerRepository],
})
export class CustomerModule {}
