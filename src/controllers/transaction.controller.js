const transactionModel=require('../models/transaction.model')
const mongoose=require('mongoose')

const ledgerModel=require('../models/ledger.model')

const emailService=require('../services/email.service')
const accountModel = require('../models/account.model')


async function createTransaction(req,res){
  const {fromAccount,toAccount,amount,idempotencyKey}=req.body

  if(!fromAccount || !toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
      message:"FromAccount,toAccount,amount and idempotencyKey are required"
    })
  }
  const fromUserAccount=await accountModel.findOne({
    _id:fromAccount
  })

  const toUserAccount=await accountModel.findOne({
    _id:toAccount
  })

  if(!fromUserAccount || !toUserAccount){
    return res.status(400).json({
      message:"Invalid fromAccount or toAccount"
    })
  }

  const isTransactionAlreadyExists=await transactionModel.findOne({
    idempotencyKey:idempotencyKey
  })
  
  if (isTransactionAlreadyExists) {

  if (isTransactionAlreadyExists.status === "COMPLETED") {
    return res.status(409).json({
      message: "Transaction has already been completed."
    });
  }

  if (isTransactionAlreadyExists.status === "FAILED") {
    return res.status(400).json({
      message: "Previous transaction failed. Please use a new idempotency key to retry."
    });
  }

  if (isTransactionAlreadyExists.status === "FROZEN") {
    return res.status(423).json({
      message: "Transaction is frozen."
    });
  }

  if (isTransactionAlreadyExists.status === "PENDING") {
    return res.status(409).json({
      message: "Transaction is already in progress."
    });
  }
}
  
  if(toUserAccount.status!=="Active" || fromUserAccount.status!=="Active"){
    return res.status(400).json({
      message:"Both fromaccount and to account must be active"
    })
  }

  const balance= await fromUserAccount.getBalance()


   if(balance<amount){
    return res.status(400).json({
      message:"Insufficient Balance"
    })
   }

   const session= await mongoose.startSession()
   session.startTransaction()
   try{

   const transaction=new transactionModel({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"
   })
    await transaction.save({ session });

   const debitLedgerEntry=await ledgerModel.create([{
    account:fromAccount,
    amount:amount,
    transaction:transaction._id,
    type:'DEBIT'
   }],{session})

   const creditLedgerEntry=await ledgerModel.create([{
    account:toAccount,
    amount:amount,
    transaction:transaction._id,
    type:'CREDIT'
   }],{session})

   transaction.status = "COMPLETED";
  await transaction.save({ session });


   await session.commitTransaction()
   session.endSession()
   await emailService.sendRegistrationEmail(req.user.email,req.user.name,amount,toAccount)
   return res.status(201).json({
    message:"Transaction completed successfully",
    transaction:transaction
   })
  }
  catch(err){
    await session.abortTransaction()
    session.endSession()
    console.log(err)
    return res.status(500).json({
      message:"Transaction is pending,Please retry after some time"
    })
  }
  
   
}
async function createIntialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey}=req.body

    if(!toAccount || !amount || !idempotencyKey){
      return res.status(400).json({
        message:"Fields are missing"
      })
    }
   
    const toUserAccount=await accountModel.findOne({
      _id:toAccount
    })

    if(!toUserAccount){
      return res.status(400).json({
        message:"Invalid toAccount"
      })
    }

    const fromUserAccount=await accountModel.findOne({
      user:req.user._id
    })

    const session =await mongoose.startSession()
    session.startTransaction()

    const transaction =new transactionModel({
      fromAccount:fromUserAccount._id,
      toAccount,
      amount,
      idempotencyKey,
      status:"PENDING"
    })

    const debitLedgerEntry=await ledgerModel.create([{
      account:fromUserAccount._id,
      amount:amount,
      transaction:transaction._id,
      type:"DEBIT"
    }],{session})

    const creditLedgerEntry=await ledgerModel.create([{
      account:toUserAccount._id,
      amount:amount,
      transaction:transaction._id,
      type:"CREDIT"
    }],{session})

    transaction.status="COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
      message:"Intial funds transaction completed succesfully",
      transactions:transaction
    })



     
}
module.exports={
  createTransaction,
  createIntialFundsTransaction,

}