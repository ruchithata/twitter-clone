import { connect } from 'mongoose';

const connectDB = async(url)=>{
    try{
        await connect(url);
        console.log("database connected successfully");
    }
    catch(err){
        console.log("database is not connected", err);
    }
}

export default connectDB;