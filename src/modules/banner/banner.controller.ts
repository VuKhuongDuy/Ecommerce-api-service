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
import { BannerService } from './banner.service';

@Controller('banner')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get()
  async get(@Res() res) {
    return res.send(ApiSuccessResponse.create(await this.bannerService.get()));
  }

  @Get('/:banner')
  async getSpecific(@Param('banner') banner, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.bannerService.getSpecific(banner)),
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() body, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.bannerService.create(body)),
    );
  }

  @Put()
  @UseGuards(AuthGuard)
  async updateProduct(@Body() body, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.bannerService.update(body)),
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id') id, @Res() res) {
    return res.send(
      ApiSuccessResponse.create(await this.bannerService.delete(id)),
    );
  }
}
