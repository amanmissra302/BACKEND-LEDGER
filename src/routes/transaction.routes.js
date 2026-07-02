const express=require('express')
const authMiddleware  = require('../middlewares/auth.middlewares')
const transactionController=require('../controllers/transaction.controller')

const router=express.Router()


router.post('/',authMiddleware.authMiddleware,transactionController.createTransaction)

router.post('/system/intial-funds',authMiddleware.authSystemUserMiddleware,transactionController.createIntialFundsTransaction)
module.exports=router