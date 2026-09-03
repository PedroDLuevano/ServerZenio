const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../database');


router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:"Estas en la ruta usuario GET"
    });
});

router.post('/:userId', async (req,res,next)=>{
    try {
        const { name, age, codePhone, cellphone, reminderText, nextReminderAt, reminderIntervalDays } = req.body;
        const parsedDate = new Date(nextReminderAt);

        if (!name || !Number.isInteger(age) || age < 18 || !codePhone || !cellphone ||
                !reminderText || Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Datos de usuario o recordatorio inválidos' });
        }

        const db = await connectToDatabase();
        const user = {
            userId: req.params.userId,
            name,
            age,
            codePhone,
            cellphone,
            reminderText,
            nextReminderAt: parsedDate,
            reminderIntervalDays: Number.isInteger(reminderIntervalDays) && reminderIntervalDays > 0
                ? reminderIntervalDays
                : 1,
            active: true,
            reminderInProgress: false,
            lastSentAt: null
        };

        await db.collection('users').insertOne(user);
        res.status(201).json({ message: 'Usuario registrado correctamente', user });
    } catch (error) {
        next(error);
    }
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