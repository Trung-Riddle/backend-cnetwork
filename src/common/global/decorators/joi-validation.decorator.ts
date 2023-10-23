import { JoiRequestValidationError } from '@root/common/global/helpers/errorHandler';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;
// kiểm tra tính hợp lệ của request body sử dụng schema từ thư viện Joi, trước khi thực hiện logic trong một method của Express.js.
export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_tatget: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));
      if (error?.details) {
        throw new JoiRequestValidationError(error.details[0].message);
      }
      // Nếu xác thực thành công, tiếp tục thực thi phương thức gốc
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
