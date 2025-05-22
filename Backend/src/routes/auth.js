const express = require('express');
const router = express.Router();
const signupSchema = require('../validators/auth-validators');
const validator = require('validator');
const bcrypt = require('bcrypt');
const {User} = require("../models/user");
const jwt = require('jsonwebtoken');
const userAuth = require('../middlewares/auth');


router.post('/signup', async(req,res)=>{
    const {firstname , lastname , password , emailId , age , gender , skills,photoUrl,about} = req.body;
    console.log("user Info : ",req.body)
    if (typeof req.body.skills === 'string') {
      req.body.skills = req.body.skills.split(',').map(s => s.trim());
      }
      console.log(skills);
   
     // check if user already exists or not

     const userExists = await User.findOne({
        emailId : emailId
     })
     
     if(userExists){
        return res.status(401).json({
            success : false,
            field : "exists",
            message : "User already exists"
        })
     }

    // input data sanitization
    const validate = signupSchema.safeParse(req.body);
   
    if(!validate.success){
        return res.status(401).json({
            success : false,
            message : validate.error.errors
        })
    }
 
    // checking if password is strong enough or not
    const isStrongPassword = validator.isStrongPassword(password);
    console.log(isStrongPassword)

    if(!isStrongPassword){
        return res.status(402).json({
            success : false,
            message : 'minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1'
        })
    }

    // hash the password before storing
    const hashedPassword = await bcrypt.hash(req.body.password,10);

  
    //store into database

    try {
        const newUser = await User.create({
            firstname : firstname,
            lastname : lastname,
            emailId : emailId,
            password : hashedPassword,
            age : age,
            gender : gender,
            skills : skills,
            photoUrl : photoUrl,
            about : about
        })

        return res.status(200).json({
            success : true,
            message : 'User added successfully',
            user : newUser
        })
        
    }catch(err){
        return res.status(500).json({
            success : false,
            message : 'Internal server error',
            error : err
        })
    }
    
})


router.post('/login', async(req,res)=>{
    const {emailId , password} = req.body;

    // check if user exists in DB
    try{
        const userExists = await User.findOne({
            emailId : emailId
        })

        if(!userExists){
            return res.status(403).json({
                success : false,
                message : 'Unauthorized User'
            })
        }

        //if User Exists then check the password
        const isPasswordValid = await bcrypt.compare(password,userExists.password);

        if(!isPasswordValid){
            return res.status(403).json({
                success : false,
                message : 'Invalid Password'
            })
        }

        //create a token and set into cookie
        const token = jwt.sign({userId : userExists._id , ip:req.ip},process.env.JWT_SECRET , {expiresIn : '1d'});
        res.cookie('token' , token , {
            maxAge : 24 * 3600000,
            httpOnly : true
        })

        return res.status(200).json({
            success : true,
            message : "loggedIn successfully",
            token : token,
            user : userExists
        })

    }catch(err){
        return res.status(404).json({
            success : false,
            message : "Invalide credentials",
            errror  : err.message
        })
    }
})


router.post('/logout',(req,res)=>{
    res.cookie('token',null,{
        maxAge : -1
    })

    return res.status(200).json({
        success : true,
        message : "logged out successful"
    })
})

router.post('/verify',userAuth , (req,res)=>{

    console.log('verifying..')

      const user = req.user;

      console.log('user' , user)  

      return res.status(200).json({
        success : true,
        message : "user verified",
        user : user
      })
})





module.exports = router;