import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';

const app = express();
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.get('/', (res,req)=>{
    res.send("Hello World!");
});

app.listen(PORT, async()=>{
    try{
        await connectDB(MONGO_URI);
        console.log(`server is running in port ${PORT}`);
    }
    catch(err){
        console.log("error while connecting to server.");
    }
});
