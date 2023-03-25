const mongoose = require('mongoose');


const userSchema = mongoose.Schema({

    Email: {type:String, required:true,unique:true},
    Name : {type:String, required:true},
    Password: {type:String, required:true},
    Age: {type:Number, required:true},
    Location: {type:String, required:true},
    Contact: {type:Number, required:true}

},{
    versionKey:false
})

const UserModel = mongoose.model('user',userSchema)

module.exports = {
    UserModel
}