const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

exports.addUser = async(req, res) => {

  try{
      const {name, email, password }= req.body;

      const hashedPassword = await bcrypt.hash(password, 10); 
      
      const newUser = new User({name: name, email: email, password: hashedPassword});
      newUser.save();

      const user = {_id: newUser._id.toString(),name: name, email: email, password: hashedPassword}
      
      console.log(user);
      const payload = user;
      const token = jwt.sign(payload,'mySecretKey')
      
      res.status(201).json({ token: token });
      
  }
  catch(err){
      
      if (Error) {
          res.status(500).json({ error: 'Email already taken' });
      } else {
          console.log(err);
          res.status(500).json({ error: 'Something went wrong' });
      }    
  }
}

exports.getLogin = async(req, res) =>{

    try{
    
    const {email, password} = req.body;
   
    if (email=='undefined' || password == 'undefined') {
      console.log('user is missing');
      return res.status(400).json({ error: 'User not found' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }  
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('password ',passwordMatch)
    if(!passwordMatch){
      return res.status(401).json({error: 'User not authorized'});
    }
    
    // Making our payload
    const loggedUser = {_id: user._id.toString(),name: user.name, email: user.email, password: user.password,isPremium: user.isPremium,totalExpense:user.totalExpense,orderId:user.orderId};

    const payload = loggedUser;
    const token = jwt.sign(payload, 'mySecretKey');
    
    res.status(200).send({ token: token});
     
    }
    catch (err) {
    
    res.status(500).json({ error: err });
    }
};
