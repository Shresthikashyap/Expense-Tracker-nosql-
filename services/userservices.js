const Expense = require('../models/Expense');

const getExpenses= async(req,res)=>{
    console.log('here***********',req.user.id.toString())
    return await Expense.find({userId:req.user.id});
}

module.exports={
    getExpenses

}