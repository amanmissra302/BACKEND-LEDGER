const userModel=require('../models/user.models')
const emailService=require('../services/email.service')
const jwt=require('jsonwebtoken')
const tokenBlacklistModel=require('../models/blackList.model')
async function userRegisterController(req,res){
   const {email,name,password}=req.body
   const isExists=await userModel.findOne({email:email});

   if(isExists){
    return res.status(422).json({
      message:"User already Exists with email",
      status:"failed"
    })
   }
   const user=await userModel.create({
    email,name,password
   })
   const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
   res.cookie('token',token)

    res.status(201).json({
    user:{
      id:user._id,
    email:user.email,
    name:user.name
    },
    token
   })

   await emailService.sendRegistrationEmail(user.email,user.name)
}
async function userLoginController(req,res){
  const {email,password}=req.body;
  const user=await userModel.findOne({email})
  if(!user){
    return res.status(401).json({
      message:"Email or password is INVALID"
    })
  }
  const isvalidPassword=await user.comparePassword(password);
  if(!isvalidPassword){
    return res.status(401).json({
      message:"Email or password is INVALID"
    })
  }

  const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
   res.cookie('token',token)
    res.status(200).json({
    user:{
      id:user._id,
    email:user.email,
    name:user.name
    },
    token
   })

}
async function userLogoutController(req,res){
   const token=req.cookies.token || req.headers.authorization?.split(" ")[1]

   if(!token){
    return res.status(400).json({
      message:"Token not found"
    })
   }
   res.clearCookie("token")

   await tokenBlacklistModel.create({
    token:token
   })

   res.status(200).json({
      message:"UserLogout succesfully"
   })


}
module.exports={
  userRegisterController,
  userLoginController,
  userLogoutController,
}