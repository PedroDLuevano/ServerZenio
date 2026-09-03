const express = require('express');
const app = express();
const morgan = require('morgan');

const userRuter = require('./Routes/user');
const webhookRouter = require('./Routes/webhook');
const database = require('./database');

// Connect to the database
database.setupDatabase()
  .then(() => {
    console.log('Base de datos lista');
  })
  .catch(console.error);

// Recuerda dejar al final la ruta genera a la que se redigirá el usuario

app.use(morgan('dev'));

app.use(express.json());

app.use('/user', userRuter);
app.use('/webhook', webhookRouter);

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