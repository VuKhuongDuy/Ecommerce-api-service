import * as env from 'dotenv';
env.config();

const config = {
  urlFe: process.env.URL_FE || 'http://localhost:8080',
  port: +(process.env.PORT || 3000),
  mongo: {
    host: process.env.MONGO_HOST || 'localhost:27017',
    user: process.env.MONGO_USER || 'root',
    pass: process.env.MONGO_PASS || 'trackingtool',
    name: process.env.MONGO_NAME || 'tracking',
    debug: process.env.MONGO_DEBUG === 'true',
  },
  oauth: {
    clientId: process.env.OAUTH_CLIENT_ID,
    urlAuth: process.env.URL_AUTH || 'https://oauth2.googleapis.com/tokeninfo',
  },
  minio: {
    endPoint: process.env.MINIO_URL || 'stg-minio-tracking.zinza.com.vn',
    port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 80,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'console',
    secretKey: process.env.MINIO_SECRET_KEY || 'Zinza@2021',
    bucket: process.env.MINIO_BUCKET || 'tracking',
  },
  jwt: {
    secretkey: 'tracking-tool-sk',
    algorithm: 'HS256',
  },
  configAppDefault: {
    action_log_time: 60, // 1 minutes
    screenshot_time: 60 * 5, // 5 minutes
    expire_time_presignurl: 20 * 60 * 60, // 20 hours
    min_size_screenshot: 1024, // 1 minutes
    max_size_screenshot: 5 * 1024 * 1024, // 5MB
    schedule_get_config: 60 * 60, // 1 hours
    expire_time_token: 7,
  },
  mail: {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 465,
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER || 'tracking2@zinza.com.vn',
    pass: process.env.MAIL_PASS || 'ibvyxgolrptuqxlf',
  },
  wsm: {
    baseUrl: process.env.WSM_ENDPOINT_URL,
    token: process.env.WSM_TOKEN,
  },
};

export default config;
