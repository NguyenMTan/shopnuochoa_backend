import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import {
  checkExtraFiles,
  checkFileImage,
  checkMainFile,
} from 'src/common/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProductService } from './product.service';
import { ParamPaginationDto } from 'src/common/param-pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Types } from 'mongoose';

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

    if (files.main_image && files.main_image.length > 1) {
      throw new BadRequestException('main_image chỉ nhận 1 file');
    }

    const newProduct = await this.productService.createProduct(product);

    if (files.main_image) {
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
    }

    if (files.extra_images) {
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
    }

    return 'Đã tạo product thành công ';
  }

  @Get()
  getAll(@Query() params: ParamPaginationDto) {
    return this.productService.findAll(params);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() product: UpdateProductDto) {
    return this.productService.updateById(id, product);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const product = await this.productService.deleteById(id);

    await this.cloudinaryService.deleteById(`products/${product._id}`);
    // this.cloudinaryService.deleteFolder(`products/${product._id}`);

    return 'Đã xóa product thành công';
  }

  @Put(':id/main_image')
  @UseInterceptors(FileInterceptor('main_image'))
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    checkMainFile(file);

    if (!file) {
      throw new BadRequestException('Không nhận được file!');
    }

    const product = await this.productService.findById(id);

    const result = await this.cloudinaryService.uploadFile(
      file,
      'products/' + product._id,
    );

    if (product.image_id) {
      await this.cloudinaryService.deleteImage(product.image_id);
    }

    const newProduct = await this.productService.uploadMainImage(product._id, {
      image_id: result.public_id,
      image_url: result.url,
    });

    return newProduct;
  }

  @Put(':id/delete_images')
  async deleteImages(
    @Param('id') id: string,
    @Body('image_ids') image_ids: string[],
  ) {
    console.log(image_ids);
    image_ids.forEach((image) => {
      this.cloudinaryService.deleteImage(image);
    });
    await this.productService.deleteExtraImages(id, image_ids);
    return 'Xoá ảnh phụ thành công!';
  }

  @Put(':id/add_images')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'extra_images' }]))
  async addImages(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      extra_images: Express.Multer.File[];
    },
  ) {
    checkExtraFiles(files.extra_images);
    if (!files.extra_images) {
      throw new BadRequestException('Không nhận được file!');
    } else {
      files.extra_images.forEach((file) => {
        this.cloudinaryService
          .uploadFile(file, 'products/' + id)
          .then((result) => {
            this.productService.uploadExtraImages(new Types.ObjectId(id), {
              image_id: result.public_id,
              image_url: result.url,
            });
          });
      });
    }

    return 'Đã ảnh phụ cho product này';
  }
}
