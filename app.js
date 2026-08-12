const express = require('express');
const app = express();

// Recuerda dejar al final la ruta genera a la que se redigirá el usuario

app.use('/user',(req,res,next)=>{
    res.status(200).json({
        message:"hello this is the user request"
    });
});


app.use('/',(req,res,next)=>{
    res.status(200).json({
        message:"hello world"
    });
});
module.exports=app;