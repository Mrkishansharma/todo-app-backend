const {Router} = require('express');
const todoRouter = Router();

const jwt = require('jsonwebtoken');

const {TodoModel} = require('../model/todo.model');


// todo add => todo/add
todoRouter.post('/add',async (req,res)=>{

    const payload = req.body;

    try {

        const todo = new TodoModel( payload );
        await todo.save();

        res.status(200).send(todo);
        
    } catch (error) {

        res.status(400).send({error:error.message});

    }
})


// fetch todos => todo/get
todoRouter.get('/get',async (req,res)=>{

    const UserID = req.body.UserID

    let { TaskName, Status, Page, Limit } = req.query

    try {

        TaskName = new RegExp(TaskName, 'i');

        if(Status){

            const todos = await TodoModel.find({UserID, TaskName,Status}).skip(Limit*(Page-1)).limit(Limit);
            res.status(200).send(todos);
            
        }else{

            const todos = await TodoModel.find({UserID, TaskName}).skip(Limit*(Page-1)).limit(Limit);
            res.status(200).send(todos);

        }
        
    } catch (error) {

        res.status(400).send({error:error.message});

    }
})

todoRouter.get('/getone/:todoID', async (req,res)=>{
    const {todoID} = req.params


    const UserID = req.body.UserID

    try {
        const verifyTodo = await TodoModel.findOne({_id:todoID});

        if(verifyTodo.UserID === UserID){

            const todo = await TodoModel.findById({_id:todoID});

            res.status(200).send(todo);

        }else{

            res.status(400).send({"msg":"You can't able to get todo of other user"});
            
        }

    } catch (error) {

        res.status(400).send({"error":error.message});  
        
    } 

})


// update todo => 
todoRouter.patch('/update/:todoID', async (req,res) => {
    const {todoID} = req.params


    const UserID = req.body.UserID

    try {
        const verifyTodo = await TodoModel.findOne({_id:todoID});

        if(verifyTodo.UserID === UserID){

            await TodoModel.findByIdAndUpdate({_id:todoID}, req.body);

            const todo = await TodoModel.findById({_id:todoID});

            res.status(200).send(todo);

        }else{

            res.status(400).send({"msg":"You can't able to update todo of other user"});
            
        }

    } catch (error) {

        res.status(400).send({"error":error.message});  
        
    } 

})

todoRouter.delete('/delete/:todoID', async (req,res) => {
    const {todoID} = req.params;


    const UserID = req.body.UserID

    try {

        const verifyTodo = await TodoModel.findOne({_id:todoID})

        if(verifyTodo.UserID == UserID){

            await TodoModel.findByIdAndDelete({_id:todoID})
            res.status(200).send({"msg":`${todoID} todo has been deleted`})

        }else{

            res.status(400).send({"msg":"You can't able to delete todo of other user"});

        }
        
        
    } catch (error) {
        
        res.status(400).send({"error":error.message});  
        
    }
})




module.exports = {
    todoRouter
}