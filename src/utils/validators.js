const Joi = require('joi');

const passwordRule = Joi.string()
  .min(5)
  .pattern(/[A-Z]/, 'uppercase')
  .pattern(/[0-9]/, 'number')
  .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'special character')
  .required();

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: passwordRule,
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: passwordRule,
});

const updatePasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: passwordRule,
});

const validate = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) throw new Error(error.details.map((d) => d.message).join(', '));
};

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  updatePasswordSchema,
  validate,
};
