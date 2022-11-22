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
import { DiscountService } from './discount.service';

@Controller('api/v1/discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Get()
  async get(@Query() query) {
    return this.discountService.get(query);
  }

  @Get('/:id')
  async getById(@Param('id') id) {
    return this.discountService.getById(id);
  }

  @Post()
  async createProduct(@Body() body) {
    return this.discountService.create(body);
  }

  @Put()
  async updateProduct() {
    return this.discountService.update();
  }

  @Delete('')
  async deleteProduct() {
    return this.discountService.delete();
  }
}
