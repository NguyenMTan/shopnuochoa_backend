import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'main_image' },
      { name: 'extra_images', maxCount: 10 },
    ]),
  )
  create(
    @Body() product: CreateProductDto,
    @UploadedFiles()
    files: {
      main_image?: Express.Multer.File[];
      extra_images?: Express.Multer.File[];
    },
  ) {
    if (!files.main_image || files.main_image.length > 1) {
      throw new BadRequestException('Lỗi');
    }

    console.log('product', product);
    console.log('file', files);
  }
}
