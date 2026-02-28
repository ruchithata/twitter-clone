import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './database/db.js';
import router from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import {v2 as cloudinary} from "cloudinary";
import cors from 'cors';
import postRouter from './routes/post.route.js';
import notificationRouter from './routes/notification.route.js';

const app = express();
app.use(express.json({limit:"10mb"}));  // to parse json data with limit of 5mb
// limit shouldn't be too high to avoid DOS attacks
app.use(cors({
    origin: 'http://localhost:3030',
    credentials: true,
}));
app.use(express.urlencoded({extended: true}));  // to parse from data urlencoded.
app.use(cookieParser());

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const __dirname = path.resolve();

app.use('/api/auth', router);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/notifications', notificationRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
} else {
    app.get('/', (req, res) => {
        res.send("Hello World!");
    });
}

app.listen(PORT, async()=>{
    try{
        await connectDB(MONGO_URI);
        console.log(`server is running in port ${PORT}`);
    }
    catch(err){
        console.log("error while connecting to server.");
    }
});
