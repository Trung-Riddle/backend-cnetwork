import Joi, { ObjectSchema } from 'joi';

const addCommentSchema: ObjectSchema = Joi.object().keys({
  userTo: Joi.string().required().messages({
    'any.required': 'userTo required'
  }),
  postId: Joi.string().required().messages({
    'any.required': 'postId required'
  }),
  comment: Joi.string().required().messages({
    'any.required': 'comment required'
  }),
  profilePicture: Joi.string().optional().allow(null, ''),
  commentsCount: Joi.number().optional().allow(null, '')
});

export { addCommentSchema };
