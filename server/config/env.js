const Joi = require('joi');

const envSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number()
        .default(5000),
    MONGODB_URI: Joi.string()
        .required()
        .description('MongoDB connection string'),
    JWT_SECRET: Joi.string()
        .required()
        .min(32)
        .description('JWT secret key'),
    SESSION_SECRET: Joi.string()
        .required()
        .min(32)
        .description('Session secret key'),
    CLIENT_URL: Joi.string()
        .uri()
        .default('http://localhost:3000'),
    COOKIE_DOMAIN: Joi.string()
        .when('NODE_ENV', {
            is: 'production',
            then: Joi.required(),
            otherwise: Joi.optional()
        })
}).unknown();

const validateEnv = () => {
    const { error, value } = envSchema.validate(process.env, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errorMessage = error.details
            .map(detail => detail.message)
            .join('\n');
        throw new Error(`Environment validation failed:\n${errorMessage}`);
    }

    return value;
};

module.exports = validateEnv; 