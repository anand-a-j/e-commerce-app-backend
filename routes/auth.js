const express = require('express');
const User = require('../models/user.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.js');

const authRouter = express.Router();


// SIGN UP Route
authRouter.post('/api/signup', async(req,res) => {
  /// Get the data from client
  /// post that data in the database
  /// return that data to the user
try{
  const {name,email,password} = req.body;

 // checking user already sign up
 const existingUser = await User.findOne({email});
 if(existingUser) {
    return res.status(400).json({msg:"User with same email already exist!"});
 }

// secure password
const hashedPassword = await bcryptjs.hash(password, 8);

// create user model
 let user = new User({
     email,
     password: hashedPassword,
     name
 });

 
 user = await user.save();
 res.json(user);

}catch(e){
 res.status(500).json({error: e.message});
}

});

// SIGN IN Route
authRouter.post('/api/signin', async(req,res)=>{
    try{
      console.log("Sign in");
     const {email, password} = req.body;

     const user = await User.findOne({email});
     if(!user){
        return res.status(400).json({msg:"User with this email does not exist!"});
     }

     const isMatch = await bcryptjs.compare(password, user.password);

     if(!isMatch){
        return res.status(400).json({msg:"Incorrect Password!!!"});
     }

     const token = jwt.sign({id:user._id,},"passwordKey");
     res.json({token,...user._doc});
     
    }catch(e){
      res.status(500).json({error:e.message});
    }
})

// vaildate token
authRouter.post('/tokenIsValid',async (req,res)=>{
  try{
   const token = req.header('x-auth-token');
   if(!token){
    return res.json(false);
   }
  const ifVerified = jwt.verify(token,'passwordKey');
  if(!ifVerified){
      return res.json(false);
   }
   const user = await User.findById(ifVerified.id)
   if(!user){
      return res.json(false);
   }
   res.json(true);
  }catch(e){
   res.status(500).json({error:e.message});
  }
})

// get user data
authRouter.get('/',auth, async(req,res)=>{
   const user = await User.findById(req.user);
   res.json({...user._doc,token:req.token});
})

// Export this file accessing for other files
module.exports = authRouter;