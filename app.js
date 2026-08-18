const express = require('express');
const app = express();
const morgan = require('morgan');

const userRuter = require('./Routes/user');
const database = require('./database');

// Connect to the database
database.connectToDatabase();

// Recuerda dejar al final la ruta genera a la que se redigirá el usuario

app.use(morgan('dev'));

app.use(express.json());

app.use('/user', userRuter);

app.use('/',(req,res,next)=>{
    res.status(200).json({
        message:"hello world"
    });
});

app.use((req,res,next)=>{
    const error = new Error('NotFound');
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    })
});


module.exports=app;