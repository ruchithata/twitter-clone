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

        if(!text || !text.trim()){
            return res.status(404).json({message: "Text field is required"});
        }
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        const comment = {user: userId, text}
        post.comments.push(comment);
        await post.save();

        const updatedComments = post.comments;
        res.status(200).json(updatedComments);

        // const updatedPost = await Post.findById(postId)
        // .populate({ path: "user", select: "-password"})
        // .populate({ path: "comments.user", select: "-password"});
        // res.status(200).json(updatedPost.comments);
        if(!text){
            return res.status(404).json({message: "Text field is required"});
        }
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

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        }
        else{
            post.likes.push(userId);
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
            await post.save();
            if(post.user.toString() !== userId.toString()) {
                const notification = new Notification({
                    from: userId,
                    to: post.user,
                    type: "like"
                });
                await notification.save();
            }

            const updatedLikes = post.likes;
            res.status(200).json({
                likes: updatedLikes,
                action: userLikedPost ? "unliked":"liked"
            });
        }
    }
    catch(err){
        console.log("Error while liking or unliking a post", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// toggle favorite (bookmark)
const favoriteUnfavoritePost = async(req, res) => {
    try{
        const userId = req.user._id;
        const {id:postId} = req.params;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message: "Post not found"});

        const alreadyFav = post.favorites.includes(userId);
        if(alreadyFav){
            await Post.updateOne({_id: postId}, {$pull: {favorites: userId}});
            await User.updateOne({_id: userId}, {$pull: {favoritePosts: postId}});
            const updated = post.favorites.filter(id => id.toString() !== userId.toString());
            res.status(200).json({favorites: updated, action: "unfavorited"});
        } else {
            post.favorites.push(userId);
            await User.updateOne({_id: userId}, {$push: {favoritePosts: postId}});
            await post.save();
            res.status(200).json({favorites: post.favorites, action: "favorited"});
        }
    } catch(err){
        console.log("Error while toggling favorite", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// get favorites for a given user
const getFavoritePosts = async(req, res) => {
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});
        const favorites = await Post.find({_id: {$in: user.favoritePosts}})
            .populate({ path: "user", select: "-password"})
            .populate({ path: "comments.user", select: "-password"})
            .populate({ path: "originalPost", populate: { path: "user", select: "-password" }});
        res.status(200).json(favorites);
    } catch(err){
        console.log("Error while getting favorite posts", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// get reshares for a given user
const getResharedPosts = async(req, res) => {
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});
        const reshares = await Post.find({_id: {$in: user.resharedPosts}})
            .populate({ path: "user", select: "-password"})
            .populate({ path: "comments.user", select: "-password"})
            .populate({ path: "originalPost", populate: { path: "user", select: "-password" }});
        res.status(200).json(reshares);
    } catch(err){
        console.log("Error while getting reshare posts", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// reshare post (toggle)
const resharePost = async(req, res) => {
    try{
        const userId = req.user._id;
        const {id:postId} = req.params;
        const original = await Post.findById(postId);
        if(!original) return res.status(404).json({message: "Post not found"});

        const already = original.reshares.includes(userId);
        if(already){
            await Post.updateOne({_id: postId}, {$pull: {reshares: userId}});
            await User.updateOne({_id: userId}, {$pull: {resharedPosts: postId}});
            // remove the created reshared post
            await Post.deleteOne({originalPost: postId, user: userId});
            // remove reshare notification(s)
            try{
                await Notification.deleteMany({ from: userId, to: original.user, type: "reshare" });
            } catch(e) {
                console.log("Error deleting reshare notifications", e);
            }
            const updated = original.reshares.filter(id => id.toString() !== userId.toString());
            res.status(200).json({reshares: updated, action: "unreshared"});
        } else {
            original.reshares.push(userId);
            await User.updateOne({_id: userId}, {$push: {resharedPosts: postId}});
            await original.save();
            const newPost = new Post({
                user: userId,
                text: original.text,
                img: original.img,
                originalPost: original._id
            });
            await newPost.save();
            // notify original post owner
            try{
                if(original.user.toString() !== userId.toString()){
                    const notification = new Notification({
                        from: userId,
                        to: original.user,
                        type: "reshare"
                    });
                    await notification.save();
                }
            } catch(e){
                console.log("Error creating reshare notification", e);
            }
            res.status(201).json({reshares: original.reshares, action: "reshared"});
        }
    } catch(err){
        console.log("Error while resharing post", err);
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
        .populate({ path: "comments.user", select: "-password"})
        .populate({ path: "originalPost", populate: { path: "user", select: "-password" } });

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
        }).populate({
            path: "originalPost",
            populate: { path: "user", select: "-password" }
        });
        if(posts.length === 0){
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
        .populate({ path: "comments.user", select: "-password"})
        .populate({
            path: "originalPost",
            populate: { path: "user", select: "-password" }
        });

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
        .populate({path: "comments.user", select: "-password"})
        .populate({
            path: "originalPost",
            populate: { path: "user", select: "-password" }
        });

        res.status(200).json(posts);
    }
    catch(err){
        console.log("Error while getting the user's posts", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export {createPost, deletePost, commentPost, likeUnlikePost, favoriteUnfavoritePost, resharePost, getAllPosts, getLikedPosts, getFavoritePosts, getResharedPosts, getFollowingPosts, getUserPosts};