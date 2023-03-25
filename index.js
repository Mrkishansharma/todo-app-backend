const express = require('express');

const cors = require('cors');

require('dotenv').config();

const {connection} = require('./db');
const { auth } = require('./middleware/auth.middleware');
const {userRouter} = require('./routes/user.routes');
const {todoRouter} = require('./routes/todo.routes')

const app = express();
app.use(express.json());
app.use(cors());


app.use('/user',userRouter);

app.use(auth)
app.use('/todo', todoRouter)

app.all('*', (req,res)=>{
    res.status(404).send("404  Route Not Found")
})

app.listen(process.env.port, async ()=>{
    try {

        await connection
        console.log(`DB connected`);

    } catch (error) {

        console.log(error.message);

    }

    console.log(`server is running on port ${process.env.port}`);
})