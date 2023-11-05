import Joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'Field must be valid',
    'string.required': 'Field must be valid',
    'string.email': 'Field must be valid'
  })
});

const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(6).max(12).messages({
    'string.base': 'Mật khẩu phải là kiểu chuỗi',
    'string.min': 'Mật khẩu tối thiểu 6 kí tự',
    'string.max': 'Mật khẩu tối đa 12 kí tự',
    'string.empty': 'Mật khẩu không được bỏ trống'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Mật khẩu Không khớp',
    'any.required': 'Xác nhận mật khẩu không được bỏ trống'
  })
});

export { emailSchema, passwordSchema };
