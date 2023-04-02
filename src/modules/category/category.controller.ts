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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiSuccessResponse } from 'src/share/api-response';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async get(@Query() query, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.categoryService.get(query)),
    );
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.categoryService.getBySlug(slug)),
    );
  }

  @Post()
  // @UseGuards(AuthGuard)
  async createProduct(@Body() body, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.categoryService.create(body)),
    );
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateProduct(@Body() body, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.categoryService.update(body)),
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id') id, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.categoryService.delete(id)),
    );
  }
}
