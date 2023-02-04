import {
  Body,
  Controller,
  Post,
  Res,
  Query,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { ApiSuccessResponse } from '../../share/api-response';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiErrorResponse } from '../../share/error-response';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login/google')
  async firstLogin(@Body() { token }, @Res() res: Response) {
    const data = await this.authService.login(token);
    if (!data) {
      return res.send(ApiErrorResponse.create('Error of server'));
    }
    return res.send(ApiSuccessResponse.create(data));
  }

  @Post('/login')
  async loginAccount(@Body() { email, password }, @Res() res: Response) {
    return res.send(
      ApiSuccessResponse.create(
        await this.authService.loginByAccount(email, password),
      ),
    );
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  async logout(@Param() { token }, @Res() res: Response) {
    return this.authService.logout(token);
  }

  @Post('/register')
  async register(@Body() data, @Res() res: Response) {
    return res.send(
      ApiSuccessResponse.create(await this.authService.register(data)),
    );
  }
}
