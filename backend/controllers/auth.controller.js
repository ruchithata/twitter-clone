import { generateTokenAndSetCookie } from "../lib/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) =>{
    try{
        const {username, fullName, password, email} = req.body;
        // const emailRegex = [/^\S+@\S+\.\S+$/];
        // if(!emailRegex.test(email)){
        //     return res.status(400).json({message: "Invalid Email Format"});
        // }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message: "Username is already taken"});
        }
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message: "Email is already taken"});
        }

        if(password.length<6){
            return res.status(400).json({message: "Password must be atleast 6 characters long"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });
        
        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({message:"User Created Successfully!",
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        }else{
            res.status(400).json({message: "Invalid User Data"});
        }
    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"});
        console.log("Error while signing up:", err);
    }
}

const login = async(req,res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPassword = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPassword){
            return res.status(400).json({message: "Invalid username or password"});
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({message: "Logged in successfully",
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImag,
        });
    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"});
        console.log("Error while logging in", err);
    }
}

const getuser = async(req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    }
    catch{
        console.log("Error while getting user details");
        res.status(500).json({message: "Internal Server Error"});
    }
}


const logout = async(req, res)=>{
    try{
        res.clearCookie("jwt",{
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });
        
        res.status(200).json({message: "Logged out successfully!"});
    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"});
        console.log("Error while logging out", err);
    }
}


export {signup, login, logout, getuser};