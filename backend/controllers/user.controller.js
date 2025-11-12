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

export {getUserProfile}