import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { checkValisIsObject } from 'src/common/common';

@Injectable()
export class BrandService {
  constructor(private readonly repository: BrandRepository) {}

  async create(brand: CreateBrandDto) {
    return await this.repository.create(brand);
  }

  async getAll(param: ParamPaginationDto) {
    const { page, limit, sort, keyword } = param;
    const newSort = sort != 'desc' ? 'asc' : 'desc';
    const filter =
      keyword !== undefined ? { name: new RegExp(keyword, 'i') } : {};
    return this.repository.findAll(page, limit, newSort, filter);
  }

  async getById(id: string) {
    checkValisIsObject(id, 'brand_id');
    return await this.repository.findOne(id);
  }

  async deleteById(id: string) {
    checkValisIsObject(id, 'brand_id');
    const brand = await this.repository.findOne(id);

    if (!brand) {
      throw new NotFoundException('Không tìm thấy thương hiệu');
    }

    if (brand.products.length > 0) {
      throw new UnprocessableEntityException(
        'Thương hiệu này vẫn còn sản phẩm',
      );
    }

    return await this.repository.deleteOne(id);
  }
}
