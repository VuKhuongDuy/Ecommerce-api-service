import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { DiscountService } from './discount.service';

@Controller('discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Get()
  async get(@Query() query) {
    return this.discountService.get(query);
  }

  @Get(':voucher')
  async getVoucher(@Param('voucher') voucher){
    return await this.discountService.getVoucher(voucher)
  }


  @Get(':id/list-products')
  async getListProduct(@Param('id') id, @Query() query) {
    return this.discountService.getListProduct(id, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() body) {
    return this.discountService.create(body);
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateProduct(@Body() body) {
    return this.discountService.update(body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id') id) {
    return this.discountService.delete(id);
  }
}
