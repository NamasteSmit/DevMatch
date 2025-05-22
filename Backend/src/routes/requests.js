const express = require('express');

const router = express.Router();

const {ConnectionRequeset} = require('../models/connectionRequest');

const userAuth = require('../middlewares/auth');
const { User } = require('../models/user');

router.post('/send/:status/:toUserId', userAuth , async(req,res)=>{
 
    try{

        //fromuserId is the loggedIn user itself
        const fromUserId = req.user._id;
        // console.log('fromuserId' , fromUserId)

        // toUserId is to whom we want to send CR to
        const toUserId = req.params.toUserId;
        // console.log('sending requestt to ' , toUserId)
        
        //status can be ['intrested' , 'ignored']
        const status  = req.params.status;

        const ALLOWED_STATUS = ["intrested" , "ignored"];

        const isStatusValid = ALLOWED_STATUS.includes(status); //return true or false

        // console.log('status validation ' , isStatusValid)

        if(!isStatusValid){
            return res.status(400).json({
                success : false,
                message : "Invalid status type"
            })
        }

        //now check whether toUserId exists in db

        // console.log('checking....')

        const toUserExist = await User.findById({
            _id : toUserId
        })

        // console.log('toUserExist' , toUserExist)

        if(!toUserExist){
            return res.status(400).json({
                success : false,
                message : "User doesnt exists"
            })
        }

        // check if fromUserId and toUserId are not same

        if(fromUserId===toUserId){
            return res.status(400).json({
                success : false,
                message : "You cant send request to yourself"
            })
        }

        // console.log("----")

        // check if there is an existing connection request

        const existingConnectionRequest = await ConnectionRequeset.findOne({
            $or : [
                {fromUserId : fromUserId , toUserId : toUserId},
                {fromUserId : toUserId  , toUserId : fromUserId}
            ]
        })

        // console.log("existing connection request " , existingConnectionRequest)

        if(existingConnectionRequest){
            return res.status(400).json({
                success : false,
                message : "connection request already exists"
            })
        }

        //createt a connection request

        const request = await ConnectionRequeset.create({
            fromUserId : fromUserId,
            toUserId : toUserId,
            status : status
        })

        return res.status(200).json({
            success : true,
            message : status==="ignored" ? "you ignored the user" : "Connection request send successfully"
        })

    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }

})


router.post('/review/:status/:requestId',userAuth , async(req,res)=>{

    try{
        const loggedInUser = req.user;
        const {status , requestId} = req.params;

        const ALLOWED_STATUS = ['accepted' , 'rejected'];

        if(!ALLOWED_STATUS.includes(status)){
            return res.status(404).json({
                success : false,
                message : "Invalid status type"
            })
        }

        //check if requestId is valid

        const connectionRequest = await ConnectionRequeset.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : 'intrested'
        })

        if(!connectionRequest){
            return res.status(404).json({
                success : false,
                message : "connection request not found"
            })
        }

        await connectionRequest.updateOne({
            status : status
        })

        return res.status(200).json({
            success : true,
            message : `connection request ${status} successfully`
        })

    }catch(err){

    }
})

module.exports = router;