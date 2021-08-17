const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
var nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config()

const User = require('../models/userModel');

//signup controller
exports.signup= async (req, res, next) => {
    const { fullName, email, password } = req.body;

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
    try {
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            status: 'success',
            data: user
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            error: err
        })
    }

    next()
}

//function to login a user
exports.login = async (req, res) =>{

    try {

   //check if the email correspond with email in database
   const user = await User.findOne({email: req.body.email})
   if(!user){
       return res.status(404).json({
           status: 'fail',
           message: "Email is not valid"
        })
   }

   //check if the password is valid
   const validPassword = await bcrypt.compare(req.body.password, user.password);
   if(!validPassword){
       return res.status(401).send("Invalid Password");
   }

    //create and assign a token using jwt
    //const token = jwt.sign({_id: user._id}, process.env.SECRET)

   res.status(200).json({
       msg: "You have logged-In successfully",
      // token,
       data: user
   })
      
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'fail',
            error: error
        })
        
    }
    
}

exports.forgotPassword = (req, res)=>{
    res.render('forgot-password')
}

//send password link to email
exports.sendPasswordLink = async (req, res)=>{
    const { email } = req.body;
    //res.send(email) //send back the email

    //check if the user exist in the database
    const user = await User.findOne({email})
   
   if(!user){
       return res.status(404).json({
           status: 'fail',
           message: "Email is not valid"
        })
   }

    //if user exit, create one time link that is valid for 15mins
    //This link should only be used once, so we create a new secret
    const secret = process.env.SECRET + user.password //unique for each user
    const payload = {
        email: user.email,
        id: user._id
    };

    //create a token
    //const token = jwt.sign(payload, secret, {expiresIn: "15m"})
    const token = jwt.sign(payload, secret)
    //generate a link
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
      });
      
      let mailOptions = {
        from: 'mosesojiko999@gmail.com',
        to: 'mosesojiko@yahoo.com',
        subject: 'Testing',
        text: `http://localhost:5000/api/v1/user/reset-password/${user._id}/${token}`
      };
      
      transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      });

    // const link = `http://localhost:5000/reset-password/${user._id}/${token}`
    // console.log(link)
    res.json({
        message:"Password reset link has been sent to your email.",
        user,
        link: `http://localhost:5000/api/v1/user/reset-password/${user._id}/${token}`
    })
    //res.send("Password reset link has been sent to your email.") //you can send actual link here.

}

//reset password, get page
exports.getResetPage = async (req, res)=>{
    const { id, token } = req.params;
    //res.send(req.params) 
    //verify the token, find the user with the id in the db
  
    const user = await User.findOne({_id: id})
    console.log(user)
    if(!user) {
        res.send('Invalid ID')
        return
    }
    //if we have a valid id, and a valid user with the id
    const secret = process.env.SECRET + user.password //getting back the secret used to generate the token
    try {
        const payload = jwt.verify(token, secret);
        res.render('reset-password', {name:user.fullName, email: user.email})
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
        
    }
  }

  //reset password
  exports.resetPassword = async (req, res)=>{
    const { id, token } = req.params;
    const { password, password2 } = req.body;

    //verify the token, find the user with the id in the db
    const user = await User.findOne({_id: id})

  if(!user){
    res.send("Invalid ID")
    return
}
const secret = process.env.SECRET + user.password;
try {
    const payload = jwt.verify(token, secret)
    //password and password2(confirm password) should match
    //find the user with the payload email and id, and update with new password
    //always hash the password before saving
    user.password = password;
    res.send(user) // used only for testing
} catch (error) {
    console.log(error.message);
    res.send(error.message)
}
}