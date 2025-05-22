const jwt = require('jsonwebtoken');
const {User} = require('../models/user');

const userAuth = async(req,res,next)=>{
    console.log("Inside userAuth Middleware")
    const token = req.cookies.token;
    console.log(token)
    
    if(!token){
        return res.status(401).json({
            success : false,
            messaage : 'unauthorized User'
        })
    }

    const isTokenValid = jwt.verify(token,process.env.JWT_SECRET);

    if(!isTokenValid){
        return res.status(403).json({
            success : false,
            messaage : 'unauthorized User'
        })
    }

    const {userId} = isTokenValid;
    const user = await User.findOne({
        _id : userId
    })
    // .select("-password");

    if(!user){
        return res.status(400).json({
            success : false,
            message : "User not Found"
        })
    }

    req.user = user;
    next()
}

module.exports = userAuth;