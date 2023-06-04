const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const validator = require('validator');
//const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;
        const transEmailApi = new Sib.TransactionalEmailsApi();
        
        const { email } =  req.body;
        const user = await User.findOne({ email });
        if(user){  
            const id = uuid.v4();
            user.createForgotpassword({ id , active: true })

            if (!validator.isEmail(email.toLowerCase())) {
                    return res.status(400).json({ error: 'Invalid email address' });
            }
             
            const sender = {email:'anjaliradcliffe7@gmail.com'};
            const receiver = [{ email }];

            const msg = {
                sender,
                to: receiver,
                subject: 'Password reset request for your account',
                textContent: 'We received a request to reset the password for your account. Please follow the link below to reset your password:',
                htmlContent: `<p>Hello,</p>
                <p>We received a request to reset the password for your account. Please follow the link below to reset your password:</p>
                <p><a href="http://13.239.34.74:3000/password/resetpassword/${id}">Reset Password</a></p><p>If you did not request this password reset, please ignore this email and contact us immediately.</p><p>Thank you,
                </p><p>Expensify</p>`
            }
 
            const response = transEmailApi.sendTransacEmail(msg)
            .then((response) => {

                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', success: true});
            })
            .catch((error) => {
                console.log(error)
                throw new Error(error);
            })
            
            console.log(response);
        }else {
            throw new Error(`User doesn't exist`)
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, success: false });
    }
}

const resetpassword = (req, res) => {
  const id = req.params._id;
  console.log(id);
  Forgotpassword.findOneAndUpdate({ _id: id }, { active: false }).then(forgotpasswordrequest => {
    if (forgotpasswordrequest) {
      res.status(200).send(`<html>
        <script>
          function formsubmitted(e){
            e.preventDefault();
            console.log('called');
          }
        </script>
        <form action="/password/updatepassword/${id}" method="get">
          <label for="newpassword">Enter New password</label>
          <input name="newpassword" type="password" required></input>
          <button>reset password</button>
        </form>
      </html>`);
      res.end();
    }
  });
};


const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
      
        Forgotpassword.findOne({ _id: resetpasswordid }).exec().then(resetpasswordrequest => {
          User.findOne({ _id: resetpasswordrequest.userId }).exec().then(user => {
            if (user) {
              // encrypt the password
              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function(err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function(err, hash) {
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.password = hash; // Update the user's password field
                  user.save().then(() => {
                    res.status(201).json({ message: 'Successfully updated the new password' });
                  });
                });
              });
            } else {
              return res.status(404).json({ error: 'No user exists', success: false });
            }
          });
        });
      }   
    catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}