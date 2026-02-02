import { json } from "express";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";

const createPost = async(req, res) => {
    try{
        const {text} = req.body;
        let {img} = req.body;
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

const deletePost = async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "You are not authorized to delete this post"});
        }
        if(post.img){
            const imgId  = post.img.split('/').pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Post deleted successfully"});
    }
    catch(err){
        console.log("Error while deleteing a post", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const commentPost = async(req, res) => {
    try{
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id.toString();

        if(!text){
            return res.status(404).json({message: "Text field is required"});
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        const comment = {user: userId, text}
        post.comments.push(comment);
        await post.save();

        res.status(200).json(post);
    }
    catch(err){
        console.log("Error while commenting on post", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const likeUnlikePost = async(req, res) => {
    try{
        const userId = req.user._id;
        const {id:postId} = req.params;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        const userLikedPost = post.likes.includes(userId);
        if(userLikedPost){
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});
            res.status(200).json({message: "Post unliked successfully"});
        }
        else{
            post.likes.push(userId);
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
            await post.save();
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            });
            await notification.save();
            res.status(200).json({message: "Post liked successfully"});
        }
    }
    catch(err){
        console.log("Error while liking or unliking a post", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const getLikedPosts = async(req, res) => {
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
        .populate({ path: "user", select: "-password"})
        .populate({ path: "comments.user", select: "-password"});

        res.status(200).json(likedPosts);
    }
    catch(err){
        console.log("Error while getting liked posts", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const getAllPosts = async(req, res) => {
    try{
        const posts = await Post.find().sort({ createdAt: -1}).populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });
        if(!posts.length === 0){
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    }
    catch(err){
        console.log("Error while getting all the posts", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const getFollowingPosts = async(req, res) => {
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const following = user.following;
        const feedPosts = await Post.find({user: {$in: following}})
        .sort({createdAt: -1}).populate({ path: "user", select: "-password"})
        .populate({ path: "comments.user", select: "-password"});

        res.status(200).json(feedPosts);
    }
    catch(err) {
        console.log("Error while getting the following users", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const getUserPosts = async(req, res) => {
    try{
        const {username} = req.params;
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const posts = await Post.find({user: user._id}).sort({createdAt: -1})
        .populate({path: "user", select: "-password"})
        .populate({path: "comments.user", select: "-password"});

        res.status(200).json(posts);
    }
    catch(err){
        console.log("Error while getting the user's posts", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export {createPost, deletePost, commentPost, likeUnlikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts};