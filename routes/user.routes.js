require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {Router} = require('express');
const userRouter = Router();

const {UserModel} = require('../model/user.model');

const {TodoModel} = require('../model/todo.model');

const {auth} = require('../middleware/auth.middleware')



// Register user => user/register
userRouter.post('/register', (req,res)=>{
    const {Email,Password,Age,Location,Contact,Name} = req.body;

    bcrypt.hash(Password, 5, async (err, hash) => {
        try {

            const user = new UserModel({Email, Password:hash, Age, Location, Contact,Name});
            await user.save();
            res.status(200).send(user);

        } catch (error) {
            res.status(400).send({"error":error.message});
        }
    });
})



// login user => user/login
userRouter.post('/login',async (req,res)=>{

    const {Email, Password} = req.body;

    try {

        const user = await UserModel.findOne({Email});

        if(user){

            bcrypt.compare(Password, user.Password, (err, result)=>{
                if(result){
                    
                    res.status(200).send({
                        "success":true,
                        "token":jwt.sign({ UserID: user._id }, process.env.SecretKey, {expiresIn:"60m"})
                        });

                }else{
                    res.status(400).send({"error":"Invalid Password 🚫"});
                }
            })

        }else{

            res.status(404).send({"msg":"User Not Found 🚫"})

        }

    } catch (error) {

        res.status(400).send({"error":error.message});
        
    }
})




// get user detail => user/get
userRouter.get('/get', auth, async (req,res)=>{
    const {UserID} = req.body;

    try {

        const user = await UserModel.findOne({_id:UserID});
        if(user){

            res.status(200).send(user);

        }else{

            res.status(404).send({"msg":"User Not Found"})

        }

    } catch (error) {

        res.status(400).send({"error": error.message})
        
    }
})


// update user details  => user/update
userRouter.patch('/update', auth, async (req,res)=>{

    const {UserID} = req.body;

    try {

        const verifyUser = await UserModel.findOne({_id:UserID});

        if(verifyUser){

            await UserModel.findByIdAndUpdate({_id:UserID}, req.body);

            const user = await UserModel.findOne({_id:UserID});


            res.status(200).send(user);

        }else{

            res.status(404).send({"msg":'User Not Found'});

        }

    } catch (error) {

        res.status(400).send({"error": error.message})

    }
})


// delete user as well as her todo task => user/delete
userRouter.delete('/delete', auth, async (req,res)=>{

    const {UserID} = req.body;

    try {

        const verifyUser = await UserModel.findOne({_id:UserID});

        if(verifyUser){

            const user = await UserModel.findByIdAndDelete({_id:UserID});
            await TodoModel.deleteMany({UserID})

            res.status(200).send({"success":true, "msg":`${UserID} user has been deleted successfully.`});

        }else{

            res.status(404).send({"msg":'User Not Found'});

        }

    } catch (error) {

        res.status(400).send({"error": error.message})

    }
})



module.exports = {
    userRouter
}