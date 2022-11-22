import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Query,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('api/v1/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async get(@Query() query) {
    return this.productService.get(query);
  }

  @Get('/:id')
  async getById(@Param('id') id) {
    return this.productService.getById(id);
  }

  @Post()
  async createProduct(@Body() body) {
    return this.productService.create(body);
  }

  @Get('/screenshot')
  async getPresignUrl(@Req() { user }) {
    return this.productService.getPresignUrl(user);
  }

  @Put()
  async updateProduct(@Body() body) {
    return this.productService.update(body);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id) {
    return this.productService.delete(id);
  }
}
