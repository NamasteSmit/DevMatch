const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
      firstname : {
        type : String,
        minLength : [3 , "Name must be of atleast 3 character"],
        maxLength : 20
      },
      lastname : {
        type : String
      },
      emailId : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('Invalid Email')
            }
        }
      },
      password : {
        type : String,
        minLength : 4,
        maxLength : 200,
        required : true
      },
      age : {
        type : Number,
        required : true
      },
      gender : {
        type : String,
        required : true,
        enum : ["male" , "female"]
      },
      photoUrl : {
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error ('Invalid photo url')
            }
        }
      },
      about : {
        type : String,
        default : "Sleeping..."
      },
      skills : {
        type : [String]
      }
},{timestamps:true});




const User = mongoose.model("User",UserSchema);


module.exports={
    User
}