import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().default(3000),
  MONGO_HOST: Joi.string().default('localhost'),
  MONGO_PORT:
    process.env.CI_BUILD_NAME == 'check:e2e-test'
      ? Joi.string()
      : Joi.number().optional().default(27017),
  MONGO_USER: Joi.string().default('root'),
  MONGO_PASS: Joi.string().default(''),
  MONGO_NAME: Joi.string().required(),
  MONGO_DEBUG: Joi.boolean().default(false),
});
