const express=require('express')
const authMiddleware=require("../middlewares/auth.middlewares")
const accountController=require('../controllers/account.controller')
const router=express.Router()

router.post('/',authMiddleware.authMiddleware,accountController.createAccountController)

router.get('/',authMiddleware.authMiddleware,accountController.getUserAccountsController)
module.exports=router

router.get('/balance/:accountId',authMiddleware.authMiddleware,accountController.getAccountBalanceController)