import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_CONFIG_NAME } from '../../configs/app.config';
import axios from 'axios';
import { TokenException } from '../../share/exceptions/token.exception';
import { NotFoundDocumentException } from '../../share/exceptions/not-found-docment.exception';
import * as moment from 'moment';
import { MomentFormatEnum } from '../../enums/moment-format.enum';
import { generateScreenshotCode } from '../../share/utils/util';
import Bcrypt from '../../share/utils/util';
import { UnAuthorizedException } from 'src/share/exceptions/unauthorized.exception';
import { UserLogin, User } from 'src/schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserLogin.name) private userLoginModel: Model<UserLogin>,

    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async verify(token: string): Promise<any> {
    const userLogin = await this.userLoginModel.find({ token: token }).exec();
    if (!userLogin || userLogin.length == 0) {
      throw new TokenException('Invalid token');
    }
    const user = await this.userModel
      .findOne({ _id: userLogin[0].user }, { password: 0 })
      .exec();

    return {
      user: user,
      token: userLogin[0].token,
    };
  }

  verifyByJwt(token: string): any {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get(`${APP_CONFIG_NAME}`).jwt.secretkey,
    });
  }

  async login(token: string): Promise<any> {
    const { clientId, urlAuth } = this.configService.get(
      `${APP_CONFIG_NAME}`,
    ).oauth;

    const resultOauth = await this.oAuthen(`${urlAuth}?id_token=${token}`);

    if (
      resultOauth.status == 200 &&
      resultOauth.data.email_verified == 'true' &&
      resultOauth.data.azp == clientId
    ) {
      const { email } = resultOauth.data;

      const user = await this.getUser(email);
      if (!user) {
        return false;
      }

      return await this.updateUserLogin(resultOauth.data, token);
    }

    throw new TokenException('Invalid token');
  }

  async loginByAccount(email: string, password: string): Promise<any> {
    const user = await this.getUser(email);
    if (!user) {
      throw new NotFoundException('Not found email');
    }

    const compare = await Bcrypt.comparePassword(password, user.password);
    if (!compare) throw new UnAuthorizedException();

    const jwtSecretKey = this.configService.get(`${APP_CONFIG_NAME}`).jwt
      .secretkey;

    const jwtToken = await this.jwtService.signAsync(
      { data: user },
      { secret: jwtSecretKey },
    );

    const userLogin = new this.userLoginModel();
    userLogin.user = user.id;
    userLogin.email = user.email;
    userLogin.token = jwtToken;
    userLogin.save();

    return {
      token: jwtToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        address: user.address,
        email: user.email,
      },
    };
  }

  async logout(token: string) {
    const result = await this.userLoginModel.deleteOne({ token: token }).exec();
    if (result.deletedCount > 0) {
      return {
        status: 'success',
      };
    } else {
      return {
        status: 'false',
      };
    }
  }

  async register(body) {
    const { name, email, password } = body;

    const hashPassword = await Bcrypt.generateHashPassword(password);

    const check = await this.userModel.find({ email }).exec();
    if (check && check.length !== 0) {
      throw new BadRequestException('Email already exists in the system.');
    }

    const newUser = new this.userModel({
      email,
      username: name,
      password: hashPassword,
      role: 'admin',
      create_at: moment(Date.now()).format(MomentFormatEnum.ISO),
      update_at: moment(Date.now()).format(MomentFormatEnum.ISO),
    });

    const result = await newUser.save();

    const { jwt } = this.configService.get(`${APP_CONFIG_NAME}`);
    const code = generateScreenshotCode(result._id, jwt.secretkey);

    return { user: result };
  }

  async oAuthen(url: string) {
    try {
      const result = await axios({
        method: 'get',
        url,
      });
      return result;
    } catch (e) {
      throw new TokenException('Invalid token');
    }
  }

  private async updateUserLogin(user, token): Promise<any> {
    const jwtSecretKey = this.configService.get(`${APP_CONFIG_NAME}`).jwt
      .secretkey;

    const jwtToken = await this.jwtService.signAsync(
      { data: token },
      { secret: jwtSecretKey },
    );

    return { token: jwtToken, user: user };
  }

  private async getUser(email: string): Promise<any> {
    const userExisted = await this.userModel
      .find({ email: email, is_deleted: false })
      .exec();
    if (userExisted && userExisted.length > 0) {
      return userExisted[0];
    } else {
      throw new NotFoundDocumentException(
        'Email does not already exists in the system.',
      );
    }
  }
}
