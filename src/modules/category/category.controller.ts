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
import { CategoryService } from './category.service';

@Controller('api/v1/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async get(@Query() query) {
    return this.categoryService.get(query);
  }

  @Get('/:id')
  async getById(@Param('id') id) {
    return this.categoryService.getById(id);
  }

  @Post()
  async createProduct(@Body() body) {
    return this.categoryService.create(body);
  }

  @Put()
  async updateProduct() {
    return this.categoryService.update();
  }

  @Delete('')
  async deleteProduct() {
    return this.categoryService.delete();
  }
}
