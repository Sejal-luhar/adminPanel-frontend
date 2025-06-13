const UserModel=require('../models/user.Model');
const { CustomError } = require('../utils/CustomError');

module.exports.getUsers=async(req,res,next)=>{
    try {
        const users=await UserModel.find({isAdmin:false});
        res.status(200).json(users);
    } catch (error) {
        next(new CustomError(error.message, 500))
    }
}

module.exports.deleteUser=async(req,res,next)=>{
    try {
        const user=await UserModel.findByIdAndDelete(req.params.id);
        if(!user) return next(new CustomError("User not found", 404));

        res.status(200).json({message: 'User Deleted Successfully'});
    } catch (error) {
        next(new CustomError(error.message, 500))
    }
}
