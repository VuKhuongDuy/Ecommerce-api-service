import {
  Body,
  Controller,
  Post,
  Res,
  Query,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiSuccessResponse } from '../../share/api-response';
import { AuthService } from './auth.service';
import { LoginDto, LogoutDto, RegisterDto } from './dtos/auth.dto';
import { Response } from 'express';
import { ApiErrorResponse } from '../../share/error-response';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login/google')
  async firstLogin(@Body() { token }: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(token);
    if (!data) {
      return res.send(ApiErrorResponse.create('Error of server'));
    }
    return res.send(ApiSuccessResponse.create(data));
  }

  @Post('/login/account')
  async loginAccount(@Body() { email, password }, @Res() res: Response) {
    return this.authService.loginByAccount(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('/logout')
  async logout(@Query() { token }: LogoutDto, @Res() res: Response) {
    return this.authService.logout(token);
  }

  @Post('/register')
  async register(@Body() data: RegisterDto, @Res() res: Response) {
    return this.authService.register(data);
  }
}
