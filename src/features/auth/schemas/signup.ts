import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string()
    .required()
    .min(6)
    .max(12)
    .pattern(new RegExp('^[a-zA-Z0-9]+$'))
    .messages({
      'string.base': 'Username phải là kiểu chuỗi',
      'string.min': 'Username tối thiểu 6 kí tự',
      'string.max': 'Username tối đa 12 kí tự',
      'string.empty': 'Username không được bỏ trống',
      'string.pattern.base': 'Username chỉ dùng A_Z, a-z, 0-9'
    }),
  password: Joi.string().required().min(6).max(12).messages({
    'string.base': 'Mật khẩu là kiểu chuỗi',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.max': 'Mật khẩu tối đa 12 ký tự',
    'string.empty': 'Không được để trống mật khẩu'
  }),
  email: Joi.string().required().email().messages({
    'string.base': 'Email là kiểu chuỗi',
    'string.email': 'Email sai định dạng',
    'string.empty': 'Email không được để trống'
  }),
  avatarColor: Joi.string().required().messages({
    'any.required': 'Avatar color is required'
  }),
  avatarImage: Joi.string().required().messages({
    'any.required': 'Avatar image is required'
  })
});

export { signupSchema };
