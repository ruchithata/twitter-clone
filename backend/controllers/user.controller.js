import User from "../models/user.model.js";

const getUserProfile = async(req, res) => {
    const {username} = req.params;
    try{
        const user = await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }
    catch(err){
        console.log("Error while getting user profile", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const followOrUnfollow = async(req, res) => {
    try{
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        if(id === req.user._id.toString()){
            return res.status(400).json({message: "You can't follow or unfollow yourself."});
        }
        if(!userToModify || !currentUser){
            return res.status(400).json({message: "User not found."});
        }

        const isFollowing = currentUser.following.includes(id);
        if(isFollowing){
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            res.status(200).json({message: "User unfollowed successfully"});
        }else{
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
            res.status(200).json({message: "User followed successfully"});
        }
    }
    catch(err){
        console.log("Error while following or unfollowing someone.", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export {getUserProfile, followOrUnfollow}