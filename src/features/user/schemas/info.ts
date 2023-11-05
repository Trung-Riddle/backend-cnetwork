import Joi, { ObjectSchema } from 'joi';

const basicInfoSchema: ObjectSchema = Joi.object().keys({
  quote: Joi.string().optional().allow(null, ''),
  work: Joi.string().optional().allow(null, ''),
  school: Joi.string().optional().allow(null, ''),
  location: Joi.string().optional().allow(null, ''),
  birthday: Joi.string().optional().allow(null, '')
});

const socialLinksSchema: ObjectSchema = Joi.object().keys({
  facebook: Joi.string().optional().allow(null, ''),
  instagram: Joi.string().optional().allow(null, ''),
  twitter: Joi.string().optional().allow(null, ''),
  youtube: Joi.string().optional().allow(null, '')
});

const changePasswordSchema: ObjectSchema = Joi.object().keys({
  currentPassword: Joi.string().required().min(6).max(12).messages({
    'string.base': 'Mật khẩu phải là kiểu chuỗi',
    'string.min': 'Mật khẩu tối thiểu 6 kí tự',
    'string.max': 'Mật khẩu tối đa 12 kí tự',
    'string.empty': 'Mật khẩu không được bỏ trống'
  }),
  newPassword: Joi.string().required().min(6).max(12).messages({
    'string.base': 'Mật khẩu phải là kiểu chuỗi',
    'string.min': 'Mật khẩu tối thiểu 6 kí tự',
    'string.max': 'Mật khẩu tối đa 12 kí tự',
    'string.empty': 'Mật khẩu không được bỏ trống'
  }),
  confirmPassword: Joi.any().equal(Joi.ref('newPassword')).required().messages({
    'any.only': 'Xác nhận mật khẩu không được bỏ trống'
  })
});

const notificationSettingsSchema: ObjectSchema = Joi.object().keys({
  messages: Joi.boolean().optional(),
  reactions: Joi.boolean().optional(),
  comments: Joi.boolean().optional(),
  follows: Joi.boolean().optional()
});

export { basicInfoSchema, socialLinksSchema, changePasswordSchema, notificationSettingsSchema };
