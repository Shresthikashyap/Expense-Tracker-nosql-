const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');

const purchasePremium = async(req,res)=>{
  
   try{
    var rzp = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    })
    
    const amount = 2000;

    const order = await rzp.orders.create({ amount, currency: "INR" });
    console.log(order);
    const newOrder = new Order({ orderid: order.id, paymentid: order.amount_paid,status: "PENDING", userId: req.user.id });
    newOrder.save();

    await User.findOneAndUpdate({_id:req.user.id},{orderId: newOrder._id})

    return res.status(201).json({ order, key_id: rzp.key_id });
   }
   catch(err){
        console.log(err);
        res.status(401).json({message:'Something went wrong',error: err});
   }
}

const updateTransactionStatus = async(req,res)=>{
  
   try{

    const {payment_id,order_id} = req.body; 
    const userId = req.user.id;
    console.log('-------------',req.user);
    const Promise1 = Order.findOneAndUpdate({_id: req.user.orderId},{ paymentid: payment_id, orderid: order_id,status : 'successful', userId: userId}); 

    const Promise2 = User.findOneAndUpdate({ _id: userId }, { isPremium: true });
    //const Promise3 = User.findOneAndUpdate({_id: userId }, { orderId: order_id});
    
    Promise.all([Promise1,Promise2]);

    return res.status(202).json({ success: true, message: 'Transaction completed' });
   }
   catch(err){
    
    throw new Error(err)
   }
}

module.exports = {
    purchasePremium,
    updateTransactionStatus
}