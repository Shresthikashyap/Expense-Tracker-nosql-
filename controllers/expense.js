const User = require('../models/user')
const Expense = require('../models/Expense');
const downloadedFile = require('../models/downloadedFile');
const S3Service = require('../services/S3services')
const UserServices = require('../services/userservices')


/************   Add Expense   **********/
const addExpense = async(req, res) => {
   
  try {
     
    const {cost ,desc ,cat} = req.body; console.log(cost ,desc ,cat);

    if(cost == undefined || cost.length === 0){
       return res.status(400).json({success:false, message:'parameter missing'})
    }
   
    console.log(req.user.id);
    let expense = new Expense({ cost: cost, description: desc, category: cat, userId: req.user.id});
    expense.save();

    const totalExpense = Number(req.user.totalExpense) + Number(cost);    console.log(totalExpense);
    
    await User.findOneAndUpdate({_id: req.user.id},{totalExpense: totalExpense});

    res.status(201).json({ expense, success:true });
  } 
  catch (err) { 
    console.log(err);
    res.status(500).json({ error: err });
  }
};

/**************  get all expenses of database  *************/
const getExpenses = async(req, res) => {
  
    try {
    
    const expenses = await Expense.find({userId: req.user.id});
    console.log(expenses)

    res.status(200).json({ expenses, success: true });

  } 
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};


/******************   download expenses **********************/
const downloadExpenses = async(req,res) => {
  try{
    
    const expenses = await UserServices.getExpenses(req);
     
    console.log('****************',expenses)
    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id;

    const fileName = `Expense${userId}/${new Date()}.txt`;   

    const fileUrl = await S3Service.uploadToS3(stringifiedExpenses, fileName);
    
    const file = new downloadedFile({ url: fileUrl, userId: userId});
    file.save();

    res.status(200).json({fileUrl, success: true});
  }
  catch(err){
    res.status(500).json({fileUrl:'',success:false,err:err})
  } 
}

/************Update expense *************/
const updateExpense = async(req,res) =>{
  
  try {

    const userId = req.params.id;
    if (userId == 'undefined'){
      return res.status(400).json({ err: 'Id is missing' });
    }

    const expense = await Expense.findById(userId);
   console.log('expense id ',expense._id);
    const {cost, desc, cat } = req.body;  

    const updatedExpenseDetail = await Expense.findOneAndUpdate({_id: expense._id},{ cost:cost, description:desc, category:cat},{ new: true }); 
    console.log('happy')
    console.log(updatedExpenseDetail)
    res.status(201).json({ expense : updatedExpenseDetail });

  } catch (err) {
    res.status(500).json({ error: err });
  }
}

/***************     delete the expenses  ******************/
const deleteExpense = async(req, res) => {

  try {
   
    const expenseId = req.params.id;
    //const {cost} = req.body; 

    if (expenseId=='undefined') {
      console.log('ID is missing');
      return res.status(400).json({ err: 'Id is missing' });
    }

    const expense = await Expense.findById(expenseId);
    console.log('***********',expense.cost);
   
    if (!expense) {  
      return res.status(404).json({ err: 'Expense not found' });  
    }  
    
    const deletedExpense = await Expense.deleteOne({_id: expenseId});
    console.log(deletedExpense);
    
    const totalExpense = Number(req.user.totalExpense) - Number(expense.cost);
    
    if(totalExpense<0){
      await User.findOneAndUpdate({_id: req.user.id},{totalExpense:0});
    }else{
      await User.findOneAndUpdate({_id: req.user.id},{totalExpense:totalExpense});
    }

    res.status(200).json({ success:true });
  } 
  catch (err) {
  
    res.status(500).json({ error: err });
  }
};

module.exports={
  addExpense, getExpenses, downloadExpenses, updateExpense, deleteExpense
}