import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.base': 'Email phải là kiểu chuỗi',
    'string.email': 'Email sai định dạng',
    'string.empty': 'Email không được để trống'
  }),
  password: Joi.string().required().min(6).max(12).messages({
    'string.base': 'Password phải là kiểu chuỗi',
    'string.min': 'Mật khẩu tối thiểu 6 kí tự',
    'string.max': 'Mật khẩu tối đa 12 kí tự',
    'string.empty': 'Mật khẩu không được bỏ trống'
  })
});

export { loginSchema };
