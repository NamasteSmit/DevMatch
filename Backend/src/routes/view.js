const express = require('express');

const router = express.Router();

const {User} = require('../models/user');
const {ConnectionRequeset} = require('../models/connectionRequest')
const userAuth = require('../middlewares/auth')

//get all the pending connection request for the loggedIn user
router.get('/requests/recieved',userAuth , async(req,res)=>{
       
      try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequeset.find({
            toUserId : loggedInUser._id,
            status  : "intrested"
        }).populate('fromUserId' , ["firstname" , "lastname" , "about" , "photoUrl"]);  // i.e we want to populate fromUserId(i.e we want to get some extra information about fromUserId so we use populate) and it will populate firstname and lastname only
 
        return res.status(200).json({
            success : true,
            connectionRequests : connectionRequests,
        })

      }catch(err){
        return res.status(500).json({
            success : false,
            message : "internal server error"
        })
      }
})


// who all accepted my connection request  or cr that i have accepted 
// i.e who all am i connected with now  
router.get('/connections',userAuth,async(req,res)=>{
    
    try{

        const loggedInUser = req.user;

        const connections = await ConnectionRequeset.find({
            $or : [
                {fromUserId : loggedInUser._id , status : "accepted"},
                {toUserId : loggedInUser._id , status : "accepted"}
            ]
        }).populate('fromUserId' , ["firstname" , "lastname" , "photoUrl" , "about"]).populate('toUserId',['firstname' , 'lastname', "photoUrl" , "about"]);

        console.log("connecitons---> ",connections)

        //my connection user can be in either fromUserId or in toUserId (so in one of either user will be there and in one I will be there)
        // so i dont want to see myself in my connection so... ( we want to see the opposite user)

        const data = connections.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){ // we cant directly compare mongodb ids  so first convert to string and then compare
                return row.toUserId
            }
            return row.fromUserId
        })

        return res.status(200).json({
            success : true,
            message : "All connection request",
            data : data
        })

    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
})


router.get('/feed' , userAuth , async(req,res)=>{
    console.log("geting feed....")
    try{

        const loggedInUser = req.user;

        const page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        limit = limit > 50 ? 50 : limit

        const skip = (page-1) * limit;


        // user should see feed of other user except :
        // 1. his own 
        // 2. it connection request
        // 3. all those connected to user
        // 4. ignored ones

        const hideUserFromFeed = new Set();

      console.log("making request...")
        const connectionRequest = await ConnectionRequeset.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select('fromUserId toUserId').populate('fromUserId' , ['firstname' , 'lastname']).populate('toUserId',['firstname','lastname'])

        console.log(connectionRequest);


       connectionRequest.forEach((req)=>{
           hideUserFromFeed.add(req.fromUserId._id.toString());
           hideUserFromFeed.add(req.toUserId._id.toString());
        })

        console.log("hide from user " , hideUserFromFeed);

        console.log('finding user');

        const feed = await User.find({
            $and : [
                { _id : { $nin : Array.from(hideUserFromFeed) } },
                { _id : {$ne : loggedInUser._id }}
            ]
        }).select('firstname lastname skills photoUrl about age gender').skip(skip).limit(limit);

        console.log(feed)

        return res.status(200).json(
            {
                success : true,
                data : feed
            }
        )

       
    }catch(err){

        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })

    }
})


module.exports = router;