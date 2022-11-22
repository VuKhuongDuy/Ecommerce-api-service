import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('api/v1/post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async get(@Query() query) {
    return this.postService.get(query);
  }

  @Get('/:id')
  async getById(@Param('id') id) {
    return this.postService.getById(id);
  }

  @Post()
  async createProduct(@Body() body) {
    return this.postService.create(body);
  }

  @Put()
  async updateProduct() {
    return this.postService.update();
  }

  @Delete('')
  async deleteProduct() {
    return this.postService.delete();
  }
}
