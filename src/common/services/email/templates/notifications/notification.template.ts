import fs from 'fs';
import ejs from 'ejs';
import { INotificationTemplate } from '#Notification/interfaces/notification.interface';

class NotificationTemplate {
  public notificationMessageTemplate(templateParams: INotificationTemplate): string {
    const { username, header, message } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/notification.template.ejs', 'utf8'), {
      username,
      header,
      message,
      image_url: 'https://res.cloudinary.com/dgyk7uloc/image/upload/v1696061331/Logo_wch0qw.jpg'
    });
  }
}

export default new NotificationTemplate();
