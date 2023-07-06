import mongoose from 'mongoose';
import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('Successfully connected mongoDB!!!');
      })
      .catch((err) => {
        log.error('Error connecting to Mongo ', err);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('Disconnected', connect);
  //để xử lý trường hợp mất kết nối tới mongo. Khi mất kết nối, hàm connect() đc gọi để thử kết nối lại.
};
