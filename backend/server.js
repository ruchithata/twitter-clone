import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import router from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';

const app = express();
app.use(express.json());
// app.use(express.urlencoded({extended: true}));  // to parse from data urlencoded.
app.use(cookieParser());

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.get('/', (req, res)=>{
    res.send("Hello World!");
});

app.use('/api/auth', router);
app.use('/api/users', userRouter);

app.listen(PORT, async()=>{
    try{
        await connectDB(MONGO_URI);
        console.log(`server is running in port ${PORT}`);
    }
    catch(err){
        console.log("error while connecting to server.");
    }
});
