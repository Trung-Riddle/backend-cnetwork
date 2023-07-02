import mongoose from "mongoose";
import { config } from "./config";

export default () => {
    const connect = () => {
        mongoose.connect(`${config.DATABASE_URL}`)
            .then(() => {
                console.log('Successfully connected mongoDB!!!')
            })
            .catch((err) => {
                console.log('Error connecting to Mongo ', err)
                return process.exit(1)
            })
    }
    connect()

    mongoose.connection.on('Disconnected', connect)
    //để xử lý trường hợp mất kết nối tới mongo. Khi mất kết nối, hàm connect() đc gọi để thử kết nối lại.
}