import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { buildPagination } from 'src/common/common';
import { Brand } from './model/brand.schema';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly service: BrandService) {}

  @Post()
  create(@Body() body: CreateBrandDto) {
    return this.service.create(body);
  }

  @Get()
  async getAll(@Query() page: ParamPaginationDto) {
    const listBrand = await this.service.getAll(page);
    return buildPagination<Brand>(listBrand, page);
  }

  @Get(':id')
  getBrand(@Param('id') _id: string) {
    return this.service.getById(_id);
  }

  @Delete(':id')
  delete(@Param('id') _id: string) {
    return this.service.deleteById(_id);
  }

  @Put(':id')
  update(@Param('id') _id: string, @Body() body: UpdateBrandDto) {
    return this.service.updateById(_id, body);
  }
}
