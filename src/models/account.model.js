const mongoose=require('mongoose')
const ledgerModel=require('./ledger.model')
const accountSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:[true,"Account must be associated with a user"],
    index:true
  },
  status:{
    type:String,
    enum:{
      values:["Active","Frozen","Closed"],
      message:"Status can be either ACTIVE,FROZEN or CLOSED",
    },
     default:"Active"
  },
  currency:{
    type:String,
    required:[true,"Currency is required for creating an account"],
    default:"INR"
  }
},{timestamps:true})
accountSchema.index({user:1,status:1}) //compound index
accountSchema.methods.getBalance=async function(){
  const result= await ledgerModel.aggregate([
    {
      $match:{
         account:this._id
      }
    },
    {
      $group:{
        _id:null,
        balance:{
          $sum:{
            $cond:[
              {$eq:['$type','CREDIT']},
              "$amount",
             { $multiply:["$amount",-1]}
            ]
          }
        }
      }
    }
   

  ])
  return result.length?result[0].balance:0;
}


const accountModel=mongoose.model('account',accountSchema)

module.exports=accountModel