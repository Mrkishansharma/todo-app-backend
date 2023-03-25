const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req,res,next) => {
    
    const authToken = req.headers.authorization;
    
    if(!authToken){
        return res.status(400).send({"msg":'Authorization Failed'})
    }

    const token = authToken.split(' ')[1];

    if(token){
        try {

            const decoded = jwt.verify(token, process.env.SecretKey);

            if(decoded){

                req.body.UserID = decoded.UserID;

                next()

            }else{

                res.status(400).send("Login Required 🚫")

            }
            
        } catch (error) {

            res.status(400).send("Token is Not Valid 🚫")

        }

    }else{

        res.status(400).send("Login Required 🚫")

    }
}


module.exports = {auth}