const userModel=require('../models/user.models')
const jwt=require('jsonwebtoken')
const tokenBlacklistModel=require('../models/blackList.model')

async function authMiddleware(req,res,next){
  const token=req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({
      message:"Unauthorized access,token is missing"
    })
  }
  const isTokenBlacklisted=await tokenBlacklistModel.findOne({token})
      if(isTokenBlacklisted){
        return res.status(400).json({
          message:"Token is blacklisted"
        })
      }
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const user=await userModel.findById(decoded.userId).select("-password")
    if (!user) {
     return res.status(401).json({
    message: "User not found"
  });
  }
    req.user=user
    next()
  }catch(err){
    return res.status(401).json({
      message:"Unauthorized access, token is invalid"
    })
  }

}

async function authSystemUserMiddleware(req,res,next){
      const token=req.cookies.token || req.headers.authorization?.split(" ")[1]

      if(!token){
        return res.status(401).json({
          message:"Unauthorized access,token is missing"
        })
      }

      const isTokenBlacklisted=await tokenBlacklistModel.findOne({token})
      if(isTokenBlacklisted){
        return res.status(400).json({
          message:"Token is blacklisted"
        })
      }

      try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user=await userModel.findById(decoded.userId).select("+systemUser")

        if(!user.systemUser){
          return res.status(403).json({
            message:"Forbidden access,not a system user"
          })
        }
        req.user=user
        next()
      }
      catch(err){
        return res.status(401).json({
          message:"Unauthorized access,token is invalid"
        })
      }
}
module.exports={
  authMiddleware,
  authSystemUserMiddleware,
}