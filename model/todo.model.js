const mongoose = require('mongoose');


const todoSchema = mongoose.Schema({
    
    UserID:{type:String, required:true},
    TaskName: {type:String, required:true},
    Status:{type:Boolean, required:true}
    
},{
    versionKey:false
})

const TodoModel = mongoose.model('todo',todoSchema)

module.exports = {
    TodoModel
}