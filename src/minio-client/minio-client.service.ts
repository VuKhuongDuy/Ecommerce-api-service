import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ServerException } from '../share/exceptions/server.exception';
import { InjectModel } from '@nestjs/mongoose';
// import { Config } from '../schemas/Config.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
// import { APP_CONFIG_NAME } from '../configs/app.config';
import * as Minio from 'minio';
import { APP_CONFIG_NAME } from 'src/configs/app.config';
@Injectable()
export class MinioClientService {
  constructor(
    private minio: MinioService,
    private configService: ConfigService,
  ) {}

  async makeBucket(bucketName: string) {
    const region = 'us-east-1';
    if (!(await this.minio.client.bucketExists(bucketName)))
      return await this.minio.client.makeBucket(bucketName, region);
  }

  async isBucketExists(bucketName: string) {
    return await this.minio.client.bucketExists(bucketName);
  }

  //upload object to minio - test/e2e
  async putObjectByPath(bucketName, objectName, filePath) {
    const metaData = { ContentType: 'application/octet-stream' };
    if (!(await this.minio.client.bucketExists(bucketName))) {
      await this.makeBucket(bucketName);
    }
    return await this.minio.client.fPutObject(
      bucketName,
      objectName,
      filePath,
      metaData,
    );
  }

  static createPathImage(str: string) {
    return `images/${str}`;
  }

  static createPathPublic(objectName: string) {
    let configService: ConfigService;
    const minioConfig = configService.get(`${APP_CONFIG_NAME}`).minio;

    return `https://${minioConfig.endPoint}/${minioConfig.bucket}/${objectName}`;
  }

  static getUrlDownload() {
    return `app`;
  }

  async presignGetObject(bucket, objectUrl: string) {
    return await this.minio.client.presignedGetObject(bucket, objectUrl);
  }

  async presignedPostPolicy(bucket, objectUrl: string, content_type: string) {
    const policy = this.minio.client.newPostPolicy();
    policy.setBucket(bucket);
    policy.setKeyStartsWith(objectUrl);

    const expires = new Date();
    expires.setSeconds(1 * 30 * 60); // 5 hours expiry.
    policy.setContentLengthRange(1024, 1024 * 1024 * 1024); // 1 kb --> 1GB
    policy.setExpires(expires);
    policy.setContentType(content_type)
    return new Promise((resolve) => {
      this.minio.client.presignedPostPolicy(policy, (err, formData) => {
        if (err) {
          throw new ServerException(err.message);
        }
        resolve(JSON.stringify(formData));
      });
    });
  }

  async listPresignGetOfObject(code, date) {
    const objectUrl = `${MinioClientService.createPathImage(code)}/${date}`;
    const listObject = await this.minio.client.listObjects(
      'tracking',
      `${objectUrl}/`,
      true,
    );
    const listUrl = {};
    return new Promise((resolve, reject) => {
      listObject.on(
        'data',
        async function (obj) {
          try {
            // obj.name = 'screenshot/vukhuongduy23@gmail.com/2021-07-26/01/13_40_50_1_thumb.jpeg'
            // obj.name = 'screenshot/vukhuongduy23@gmail.com/2021-07-26/02/13_40_50_1.jpeg'
            const hour = parseInt(obj.name.split(objectUrl)[1].split('/')[1]);

            const arr = obj.name.split('/');

            // imagename = '13_40_50_1_thumb.jpg'
            const imageName = arr[arr.length - 1];
            const temp = imageName.split(/[\._]/);
            if (temp.length < 2) {
              return;
            }
            // minute = 13
            const minute = parseInt(temp[0]);
            const keyboard_idle = temp.length >= 5 ? temp[1] : 0;
            const mouse_idle = temp.length >= 5 ? temp[2] : 0;

            // numberScreen = 1
            let numberScreen = temp.length >= 5 ? temp[3] : temp[1]; // check case 56_1_thumb.jpeg and 56_1.jpeg
            if (!numberScreen || temp.length == 2) {
              numberScreen = 1;
            }

            if (!listUrl[hour]) {
              listUrl[hour] = {};
            }
            if (!listUrl[hour][minute]) {
              listUrl[hour][minute] = {};
            }
            if (!listUrl[hour][minute][numberScreen]) {
              listUrl[hour][minute][numberScreen] = {};
            }
            if (!listUrl[hour][minute]['idle']) {
              listUrl[hour][minute]['idle'] = {
                key: keyboard_idle,
                mouse: mouse_idle,
              };
            }

            if (temp.length > 2 && temp[temp.length - 2] == 'thumb') {
              listUrl[hour][minute][numberScreen]['thumb'] = imageName;
            } else {
              listUrl[hour][minute][numberScreen]['origin'] = imageName;
            }
          } catch (e) {
            console.log(`Object ${obj} invalid format`);
          }
        }.bind(this),
      );
      listObject.on('error', reject);
      listObject.on('end', () => {
        resolve({ presignUrls: listUrl, date, code });
      });
    });
  }

  async getListUrlDownload(bucket, objectUrl: string) {
    const listObject = await this.minio.client.listObjects(
      bucket,
      `${objectUrl}/`,
      true,
    );
    const listVersion = {};
    return new Promise((resolve, reject) => {
      listObject.on(
        'data',
        async function (obj) {
          try {
            // 'app/linux/linux_18.04.zip'
            const arr = obj.name.split('/');
            if (arr.length < 3) {
              return;
            }

            const os = arr[1];
            const version = arr[2];

            const result = await this.minio.client.presignedGetObject(
              bucket,
              obj.name,
            );
            if (!listVersion[os]) {
              listVersion[os] = {};
            }
            if (!listVersion[os][version]) {
              listVersion[os][version] = {};
            }
            if (result) {
              listVersion[os][version] = result.replace(
                /^http:\/\//,
                'https://',
              );
            }
          } catch (e) {
            console.log(`Object ${obj} invalid format`);
          }
        }.bind(this),
      );
      listObject.on('error', reject);
      listObject.on('end', () => {
        resolve(listVersion);
      });
    });
  }

  async getCountObject(bucket, objectUrl: string): Promise<number> {
    const listObject = await this.minio.client.listObjects(
      bucket,
      `${objectUrl}/`,
      true,
    );
    let countObject = 0;
    return new Promise((resolve, reject) => {
      listObject.on('data', () => {
        countObject++;
      });
      listObject.on('error', reject);
      listObject.on('end', () => {
        resolve(Math.floor(countObject / 2)); // original + thumbnail = 1 image
      });
    });
  }

  async getListFolder(
    bucket,
    objectUrl: string,
    from_time: string,
    to_time: string,
  ): Promise<Array<string>> {
    const listObject = await this.minio.client.listObjects(
      bucket,
      `${objectUrl}/`,
      false,
    );
    const list = [];
    return new Promise((resolve, reject) => {
      listObject.on('data', (obj) => {
        const arr = obj.prefix.split('/');
        const date = arr[arr.length - 2];
        if (date >= from_time && date <= to_time) {
          list.push(date);
        }
      });
      listObject.on('error', reject);
      listObject.on('end', () => {
        resolve(list);
      });
    });
  }

  async setObjectPolicy(pathObject: string) {
    const { minio } = this.configService.get(`${APP_CONFIG_NAME}`);
    const { bucket } = minio;
    pathObject = `${bucket}/${pathObject}/*`;
    const rule = {
      Action: ['s3:GetObject'],
      Effect: 'Allow',
      Principal: {
        AWS: '*',
      },
      Resource: `arn:aws:s3:::${pathObject}`,
      // Condition: {
      //   StringLike: { 'aws:Referer': [`${urlFe}/*`] },
      // },
    };
    const defaultPolicyJsonStr = JSON.stringify({
      Version: '2012-10-17',
      Statement: [rule],
    });
    try {
      const oldPolicy = await this.minio.client.getBucketPolicy(bucket);

      const obPolicy = JSON.parse(oldPolicy);
      const indexRule = obPolicy.Statement.findIndex(
        (m) => m.Resource == rule.Resource,
      );
      if (indexRule < 0) {
        obPolicy.Statement.push(rule);
      } else {
        obPolicy.Statement[indexRule] = rule;
      }
      await this.minio.client.setBucketPolicy(bucket, JSON.stringify(obPolicy));
    } catch (e) {
      await this.minio.client.setBucketPolicy(bucket, defaultPolicyJsonStr);
      // await this.logQueryService.writeUpdateLog(
      //   null,
      //   JSON.stringify({
      //     model: LogQuery.name,
      //     query: `this.minio.client.setBucketPolicy(bucket, defaultPolicyJsonStr)`,
      //   }),
      // );
    }
  }

  async migration(bucket, email, ss_code) {
    const listObject = await this.minio.client.listObjects(
      bucket,
      `${MinioClientService.createPathImage(email)}`,
      true,
    );
    return new Promise((resolve, reject) => {
      listObject.on(
        'data',
        async function (obj) {
          try {
            const conds = new Minio.CopyConditions();
            conds.setMatchETag(obj.etag);
            const arr = obj.name.split('/');
            const pathImage = `${arr[2]}/${arr[3]}/${arr[4]}`;
            const result = await this.minio.client.copyObject(
              bucket,
              `${MinioClientService.createPathImage(ss_code)}/${pathImage}`,
              `/${bucket}/${MinioClientService.createPathImage(
                email,
              )}/${pathImage}`,
            );
            return result;
          } catch (e) {
            console.log({ e });
          }
        }.bind(this),
      );
      listObject.on('error', reject);
      listObject.on('end', () => {
        resolve('listVersion');
      });
    });
  }
}
