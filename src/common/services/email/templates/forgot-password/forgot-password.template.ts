import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
  public passWordResetTemplate(username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password.template.ejs', 'utf-8'), {
      username, resetLink,
      image_url: 'https://res.cloudinary.com/dgyk7uloc/image/upload/v1696061331/Logo_wch0qw.jpg'
    });
  }
}

export default new ForgotPasswordTemplate();
