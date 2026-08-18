const express = require('express');
const router = express.Router();


router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:"Estas en la ruta usuario GET"
    });
});

router.post('/:userId',(req,res,next)=>{

    const userId = req.params.userId;

    res.status(200).json({
        message:"Estas en la ruta usuario POST",
        userName:req.body.name,
        userAge:req.body.age,
        userId:userId
    });
});

router.put('/',(req,res,next)=>{
    res.status(200).json({
        message:"Estas en la ruta usuario PUT"
    });
});

router.delete('/',(req,res,next)=>{
    res.status(200).json({
        message:"Estas en la ruta usuario DELETE"
    });
});

module.exports=router;