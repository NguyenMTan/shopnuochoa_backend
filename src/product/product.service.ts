import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryRepository } from 'src/category/category.repository';
import { checkValisIsObject } from 'src/common/common';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { Product } from 'src/product/model/product.schema';
import { ProductRepository } from 'src/product/product.repository';
import { UpdateProductDto } from './dto/update-product.dto';
import { BrandRepository } from 'src/brand/brand.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRespository: BrandRepository,
  ) {}

  async createProduct(createProduct: CreateProductDto) {
    let { category_id, brand_id, ...data } = createProduct;

    checkValisIsObject(category_id, 'category_id');
    checkValisIsObject(brand_id, 'brand_id');

    const category = await this.categoryRepository.findOne(category_id);
    const brand = await this.brandRespository.findOne(brand_id);

    if (!category) {
      throw new NotFoundException('Khong tim thay category');
    }

    if (!brand) {
      throw new NotFoundException('Khong tim thay brand');
    }

    const product = {
      _id: new Types.ObjectId(),
      category_id: Types.ObjectId.createFromHexString(category_id),
      brand_id: Types.ObjectId.createFromHexString(brand_id),
      ...data,
    };

    try {
      const newProduct = await this.productRepository.create(
        product as Product,
      );
      await this.brandRespository.addProductId(
        newProduct.brand_id.toHexString(),
        newProduct._id.toHexString(),
      );
      await this.categoryRepository.addProductId(
        newProduct.category_id.toHexString(),
        newProduct._id.toHexString(),
      );
      return newProduct;
    } catch (error) {
      throw new UnprocessableEntityException('Ten san pham da ton tai');
    }
  }

  uploadMainImage(id: Types.ObjectId, { image_id, image_url }) {
    return this.productRepository.uploadMainFile(id, { image_id, image_url });
  }

  uploadExtraImages(
    id: Types.ObjectId,
    files: { image_id: string; image_url: string },
  ) {
    return this.productRepository.uploadExtraFiles(id, files);
  }

  findAll(params: ParamPaginationDto) {
    const { page, limit, sort, keyword } = params;

    const newSort = sort != 'asc' ? 'desc' : 'asc';

    return this.productRepository.findAll(page, limit, newSort, keyword);
  }

  async deleteById(id: string) {
    checkValisIsObject(id, 'product id');
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new NotFoundException('Khong tim thay product');
    }

    try {
      await this.productRepository.deleteOne(id);
      await this.brandRespository.removeProductId(
        product.brand_id,
        product._id,
      );
      await this.categoryRepository.removeProductId(
        product.category_id,
        product._id,
      );
      return product;
    } catch (error) {
      console.log('Error', error);
      throw new NotFoundException('Loi trong try catch');
    }

    // const product = await this.productRepository.deleteOne(id);

    // if (!product) {
    //   throw new NotFoundException('Khong tim thay product');
    // }

    // return product;
  }

  async findById(id: string) {
    checkValisIsObject(id, 'product_id');

    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`Khong tim thay product co id ${id}`);
    }

    return product;
  }

  async updateById(id: string, updateProduct: UpdateProductDto) {
    checkValisIsObject(id, 'product id');
    checkValisIsObject(updateProduct.category_id, 'category_id');
    checkValisIsObject(updateProduct.brand_id, 'brand_id');

    const { category_id, brand_id, ...data } = updateProduct;

    const category = await this.categoryRepository.findOne(category_id);
    const brand = await this.brandRespository.findOne(brand_id);

    if (!category) {
      throw new NotFoundException('Khong tim thay category');
    }

    if (!brand) {
      throw new NotFoundException('Khong tim thay brand');
    }

    const product = await this.productRepository.updateOne(id, {
      _id: new Types.ObjectId(id),
      category_id: new Types.ObjectId(category_id),
      brand_id: new Types.ObjectId(brand_id),
      ...data,
    });
    if (!product) {
      throw new NotFoundException('Khong tim thay product');
    }

    return product;
  }

  async deleteExtraImages(id: string, image_id: string[]) {
    checkValisIsObject(id, 'product id');
    const product = await this.productRepository.deleteExtraImages(
      new Types.ObjectId(id),
      image_id,
    );

    if (!product) {
      throw new NotFoundException('Khong tim thay product');
    }

    return product;
  }
}
