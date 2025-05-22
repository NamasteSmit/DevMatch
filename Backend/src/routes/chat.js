const express = require('express');
const { Chat } = require('../models/chat');
const userAuth = require('../middlewares/auth');


const router = express.Router();


router.get('/view-all-chat/:targetId', userAuth,async(req,res)=>{
      const {targetId} = req.params;
      const userId = req.user
      console.log("userid",userId)
      console.log('targetuserid',targetId)

      let chat = await Chat.findOne({
        participants : {
            $all : [userId , targetId]
        }
      }).populate('messages.senderId',"firstname lastname photoUrl about").populate('participants' , "firstname lastname");

      if(!chat){
        chat = await Chat.create({
            participants : [userId,targetId],
            messages : []
        });

        await chat.save();
      }

      console.log("chat route : " , chat)

      return res.status(200).json({
        success : true,
        chat : chat
      })


})

module.exports = router;