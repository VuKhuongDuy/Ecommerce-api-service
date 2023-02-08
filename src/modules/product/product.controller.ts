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
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiSuccessResponse } from 'src/share/api-response';
import { ProductService } from './product.service';

@Controller('/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async get(@Query() query, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.productService.get(query)),
    );
  }

  @Get('/s3')
  async getPresignUrl(@Query() query, @Res() res) {
    const { image_name, content_type } = query;
    return res.send(
      ApiSuccessResponse.create(
        await this.productService.getPresignUrl(image_name, content_type),
      ),
    );
  }

  @Get('/slug/:category_slug/:slug')
  async getBySlug(
    @Param('category_slug') category_slug,
    @Param('slug') slug,
    @Res() res,
  ) {
    return res.send(
      ApiSuccessResponse.create(
        await this.productService.getBySlug(`${category_slug}/${slug}`),
      ),
    );
  }

  @Get('/:prefix')
  async getByPrefix(@Param('prefix') prefix, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.productService.getByPrefix(prefix)),
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() body, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.productService.create(body)),
    );
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateProduct(@Body() body, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.productService.update(body)),
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id') id, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.productService.delete(id)),
    );
  }
}
