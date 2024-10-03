import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { DatabaseModule } from 'src/database/database.module';
import { Product, ProductSchema } from './model/product.schema';
import {
  ProductImage,
  ProductImageSchema,
} from './model/product-images.schema';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductImage.name, schema: ProductImageSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
