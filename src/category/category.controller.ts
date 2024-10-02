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
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() category: CreateCategoryDto) {
    return this.service.createCategory(category);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllCategory() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') _id: string) {
    return this.service.findById(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOne(@Param('id') _id: string) {
    return this.service.deleteById(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateOne(@Param('id') _id: string, @Body() update: UpdateCategoryDto) {
    return this.service.updateById(_id, update);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Query('status') status: boolean) {
    return this.service.updateStatusById(id, status);
  }
}
