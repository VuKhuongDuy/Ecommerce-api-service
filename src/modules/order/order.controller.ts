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
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async get(@Query() query) {
    return this.orderService.get(query);
  }

  @Get('/:id')
  async getById(@Param('id') id) {
    return this.orderService.getById(id);
  }

  @Post()
  async createProduct(@Body() body) {
    return this.orderService.create(body);
  }

  @Put()
  async updateProduct() {
    return this.orderService.update();
  }

  @Delete('')
  async deleteProduct() {
    return this.orderService.delete();
  }
}
