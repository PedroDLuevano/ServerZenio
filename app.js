const express = require('express');
const app = express();
const morgan = require('morgan');

const userRuter = require('./Routes/user');

// Recuerda dejar al final la ruta genera a la que se redigirá el usuario

app.use(morgan('dev'));
app.use('/user', userRuter);

app.use('/',(req,res,next)=>{
    res.status(200).json({
        message:"hello world"
    });
});

module.exports=app;