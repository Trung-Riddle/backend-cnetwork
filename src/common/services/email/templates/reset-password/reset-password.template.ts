import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from '#User/interfaces/user.interface';

class ResetPasswordTemplate {
  public passwordResetConfirmationTemplate(templateParams: IResetPasswordParams): string {
    const { username, email, ipAddress, date } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/reset-password.template.ejs', 'utf8'), {
      username,
      email,
      ipAddress,
      date,
      image_url: 'https://res.cloudinary.com/dgyk7uloc/image/upload/v1696061331/Logo_wch0qw.jpg'
    });
  }
}

export default new ResetPasswordTemplate();
