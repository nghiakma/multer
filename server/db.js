import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DB_URL || '';

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl).then((data) => {
            console.log(`Database đã được kết nối với ${data.connection.host}`)
        })
    } catch (error) {
        console.log(error.message);
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;
