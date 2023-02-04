import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Query,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { ApiSuccessResponse } from 'src/share/api-response';
import { PostService } from './post.service';

@Controller('/post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async get(@Query() query, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.postService.get(query)),
    );
  }

  @Get('/:id')
  async getById(@Param('id') id, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.postService.getById(id)),
    );
  }

  @Post()
  async createProduct(@Body() body, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.postService.create(body)),
    );
  }

  @Put()
  async updateProduct(@Body() body, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.postService.update(body)),
    );
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.postService.delete(id)),
    );
  }
}
