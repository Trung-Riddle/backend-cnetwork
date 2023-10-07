import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(10).messages({
    'string.base': 'Username phải bắt đầu bằng chữ cái',
    'string.min': 'Username phải có ít nhất 4 ký tự',
    'string.max': 'Username tối đa 10 ký tự',
    'string.empty': 'Không được để trống username'
  }),
  password: Joi.string().required().min(6).max(10).messages({
    'string.base': 'Mật khẩu nên có cả chữ và số',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.max': 'Mật khẩu tối đa 10 ký tự',
    'string.empty': 'Không được để trống mật khẩu'
  }),
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be of type string',
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
