import { registerAs } from '@nestjs/config';
import config from './configuration';

export const APP_CONFIG_NAME = 'app';

export default registerAs(APP_CONFIG_NAME, () => config);
