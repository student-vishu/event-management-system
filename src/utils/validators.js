const Joi = require('joi');

const passwordRule = Joi.string()
  .min(5)
  .pattern(/^\S+$/, 'no spaces')
  .pattern(/[A-Z]/, 'uppercase')
  .pattern(/[0-9]/, 'number')
  .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'special character')
  .required();

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: passwordRule,
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
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

const titleRule = Joi.string()
  .trim()
  .min(2)
  .max(100)
  .pattern(/^[a-zA-Z0-9\s\-_,.'!&()]+$/, 'valid title characters')
  .pattern(/[a-zA-Z]/, 'at least one letter')
  .required();

const descriptionRule = Joi.string()
  .trim()
  .min(1)
  .max(500)
  .optional();

const locationRule = Joi.string()
  .trim()
  .min(2)
  .max(100)
  .pattern(/^[a-zA-Z0-9\s\-_,.'()]+$/, 'valid location characters')
  .optional();

const createEventSchema = Joi.object({
  title: titleRule,
  description: descriptionRule,
  date: Joi.string().required(),
  location: locationRule,
});

const updateEventSchema = Joi.object({
  title: titleRule.optional(),
  description: descriptionRule,
  date: Joi.string().optional(),
  location: locationRule,
});

const inviteUsersSchema = Joi.object({
  emails: Joi.array()
    .items(Joi.string().trim().email({ tlds: { allow: false } }).required())
    .min(1)
    .required(),
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
  createEventSchema,
  updateEventSchema,
  inviteUsersSchema,
  validate,
};
