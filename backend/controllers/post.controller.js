import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";

const createPost = async(req, res) => {
    try{
        const {text, img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        if(!text && !img){
            return res.status(400).json({message: "Post must have text or image"});
        }
        if(img){
            const uploadedRes = await cloudinary.uploader.upload(img);
            img = uploadedRes.secure_url;
        }
        
        const newPost = new Post({
            user: userId,
            text,
            img
        })
        await newPost.save();
        res.status(201).json(newPost);
    }
    catch(err){
        console.log("Error while creating post", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export {createPost};