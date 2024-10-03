import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryConfig } from './cloudinary.config';

@Module({
  providers: [CloudinaryService, CloudinaryConfig],
})
export class CloudinaryModule {}
