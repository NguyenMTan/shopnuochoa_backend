import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { checkFileImage } from 'src/common/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProductService } from './product.service';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly productService: ProductService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'main_image' }, { name: 'extra_images' }]),
  )
  async create(
    @Body() product: CreateProductDto,
    @UploadedFiles()
    files: {
      main_image: Express.Multer.File[];
      extra_images: Express.Multer.File[];
    },
  ) {
    checkFileImage(files);

    if (files.main_image.length > 1) {
      throw new BadRequestException('main_image chỉ nhận 1 file');
    }

    const newProduct = await this.productService.createProduct(product);

    this.cloudinaryService
      .uploadFile(files.main_image[0], 'products/' + newProduct._id)
      .then((result) => {
        this.productService.uploadMainImage(newProduct._id, {
          image_id: result.public_id,
          image_url: result.url,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    files.extra_images.forEach(async (file) => {
      this.cloudinaryService
        .uploadFile(file, 'products/' + newProduct._id)
        .then((result) => {
          this.productService.uploadExtraImages(newProduct._id, {
            image_id: result.public_id,
            image_url: result.url,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });

    return 'Đã tạo product thành công ';
  }

  @Get()
  getAll(@Query() params: ParamPaginationDto) {
    return this.productService.findAll(params);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const product = await this.productService.deleteById(id);

    this.cloudinaryService.deleteImage(product.image_id);
    const deleteImages = async (imgs) => {
      const deletePromises = imgs.map((image) =>
        this.cloudinaryService.deleteImage(image.image_id),
      );

      try {
        await Promise.all(deletePromises);
      } catch (error) {
        console.error('Error deleting images:', error);
      }
    };

    await deleteImages(product.images);

    return 'Đã xóa product thành công';
  }
}
