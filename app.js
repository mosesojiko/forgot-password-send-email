
const express = require('express')
const jwt = require('jsonwebtoken')

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs');

//dummy database
let user = {
    id: "shggfddffgmgk",
    email:"example@gmail.com",
    password: "ajjshdhdfffnfgjgj.dkdfjfjghghgjh"
}
//create a secret
const JWT_SECRET = "some super secret";

app.get('/', (req, res) =>{
    res.send("Hello world")
})

app.get('/forgot-password', (req, res)=>{
    res.render('forgot-password')
})

app.post('/forgot-password', (req, res)=>{
    const { email } = req.body;
    //res.send(email) //send back the email

    //check if the user exist in the database
    if(email !== user.email){
        res.send("User not registered")
        return
    }
    //if user exit, create one time link that is valid for 15mins
    //This link should only be used once, so we create a new secret
    const secret = JWT_SECRET + user.password //unique for each user
    const payload = {
        email: user.email,
        id: user.id
    };

    //create a token
    const token = jwt.sign(payload, secret, {expiresIn: "15m"})
    //generate a link
    const link = `http://localhost:5000/reset-password/${user.id}/${token}`
    console.log(link)
    res.send("Password reset link has been sent to your email.") //you can send actual link here.

})

app.get('/reset-password/:id/:token', (req, res)=>{
  const { id, token } = req.params;
  //res.send(req.params) 
  //verify the token, find the user with the id in the db

  if(id !== user.id){
      res.send("Invalid ID")
      return
  }
  //if we have a valid id, and a valid user with the id
  const secret = JWT_SECRET + user.password //getting back the secret used to generate the token
  try {
      const payload = jwt.verify(token, secret);
      res.render('reset-password', {email: user.email})
  } catch (error) {
      console.log(error.message)
      res.send(error.message)
      
  }
})

app.post('/reset-password/:id/:token', (req, res)=>{
    const { id, token } = req.params;
    const { password, password2 } = req.body;

    //verify the token, find the user with the id in the db

  if(id !== user.id){
    res.send("Invalid ID")
    return
}
const secret = JWT_SECRET + user.password;
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
})

app.listen(5000, ()=>{
    console.log(`Server listening on port 5000`)
})