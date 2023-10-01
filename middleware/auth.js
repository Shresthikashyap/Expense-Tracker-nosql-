const jwt = require('jsonwebtoken');
const User = require('../models/user');
const order = require('../models/order')

const authenticate = async(req,res,next) => {
    try{
        //console.log(req.headers)
       
        const token = await req.header('Authorization');
        
        const user =  jwt.verify(token,process.env.TOKEN_SECRET,(err, decoded) => {
            if (err) {
              console.log(err);
            } else {
              return decoded;
            }
          });
        
        await User.findById(user._id).then((user)=>{
           req.user = user;
        
           next();
        })
    }
    catch(err){
      console.log('here')
        return res.status(401).json({success: false})
    }
}


module.exports = {
  authenticate
};