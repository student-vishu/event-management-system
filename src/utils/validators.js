const Joi = require('joi');
const { VALIDATION } = require('../constants');

const passwordRule = Joi.string()
  .min(VALIDATION.PASSWORD_MIN_LENGTH)
  .pattern(VALIDATION.NO_SPACES_REGEX, 'no spaces')
  .pattern(VALIDATION.HAS_UPPERCASE_REGEX, 'uppercase')
  .pattern(VALIDATION.HAS_NUMBER_REGEX, 'number')
  .pattern(VALIDATION.HAS_SPECIAL_CHAR_REGEX, 'special character')
  .required();

const registerSchema = Joi.object({
  name: Joi.string().trim().min(VALIDATION.NAME_MIN_LENGTH).required(),
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
  .min(VALIDATION.TITLE_MIN_LENGTH)
  .max(VALIDATION.TITLE_MAX_LENGTH)
  .pattern(VALIDATION.VALID_TITLE_CHARS_REGEX, 'valid title characters')
  .pattern(VALIDATION.HAS_LETTER_REGEX, 'at least one letter')
  .required();

const descriptionRule = Joi.string()
  .trim()
  .min(VALIDATION.DESC_MIN_LENGTH)
  .max(VALIDATION.DESC_MAX_LENGTH)
  .optional();

const locationRule = Joi.string()
  .trim()
  .min(VALIDATION.LOCATION_MIN_LENGTH)
  .max(VALIDATION.LOCATION_MAX_LENGTH)
  .pattern(VALIDATION.VALID_LOCATION_CHARS_REGEX, 'valid location characters')
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
