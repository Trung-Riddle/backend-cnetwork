import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import moment from 'moment';
import publicIP from 'ip';
import { BadRequestError } from '#Global/helpers/errorHandler';
import { joiValidation } from '#Global/decorators/joi-validation.decorator';
import { changePasswordSchema } from '#User/schemas/info';
import { authService } from '#Services/db/auth.service';
import { IAuthDocument } from '#Auth/interfaces/auth.interface';
import { userService } from '#Services/db/user.service';
import { IResetPasswordParams } from '#User/interfaces/user.interface';
import resetPasswordTemplate from '#Services/email/templates/reset-password/reset-password.template';
import emailQueue from '#Services/queues/email.queue';

export class Update {
  @joiValidation(changePasswordSchema)
  public async password(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      throw new BadRequestError('Passwords do not match.');
    }
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(req.currentUser!.username);
    const passwordsMatch: boolean = await existingUser.comparePassword(currentPassword);
    // console.log(passwordsMatch);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    const hashedPassword: string = await existingUser.hashPassWord(newPassword);
    userService.updatePassword(`${req.currentUser!.username}`, hashedPassword);

    const templateParams: IResetPasswordParams = {
      username: existingUser.username!,
      email: existingUser.email!,
      ipAddress: publicIP.address(),
      date: moment().format('DD//MM//YYYY HH:mm')
    };
    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('changePassword', { template, receiverEmail: existingUser.email!, subject: 'Mật khẩu của bạn đã được thay đổi' });
    res.status(HTTP_STATUS.OK).json({
      message: 'Mật khẩu đã đổi thành công, bạn hãy đăng nhâp lại.'
    });
  }
}
