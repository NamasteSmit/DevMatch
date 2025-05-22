const mongoose = require('mongoose');
const {User} = require('./user');

const connectionRequestSchema = new mongoose.Schema({
  fromUserId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },

  toUserId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },

  status : {
    type : String,
    default : 'pending',
    required : true,
    enum : {
      values : ['ignored' , 'intrested' , 'accepted' , 'rejected'],
      message : '${VALUE} is not valid status'
    }
  }
},{
  timestamps : true
})

connectionRequestSchema.index({fromUserId : 1 , toUserId : 1})


const ConnectionRequeset = mongoose.model('ConnectionRequest' , connectionRequestSchema);

//this is a schema method 
//this is like a middleware that will be called before saving the data into database
//i.e pre-save .... you can perform any task over here that you want to do before saving the data into db
//and always use normal function only ------  dont use arrow function with pre method
// connectionRequestSchema.pre('save' , function(){
//      const connectionRequest = this;
// })

module.exports = {
    ConnectionRequeset
}
