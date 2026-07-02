const express=require('express')
const authController=require('../controllers/auth.controller')
const router=express.Router()
router.use('/register',authController.userRegisterController);
router.use('/login',authController.userLoginController);

router.post('/logout',authController.userLogoutController)

module.exports=router