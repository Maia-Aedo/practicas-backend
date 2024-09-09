const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

app.get('/', (req, res) =>{
    res.cookie('sessionId', '12345678', {
        expires: new Date(Date.now() + 86400000), // 24 horas
        httpOnly: true,
        secure: true
    });
    res.send('Cookie de sesión establecida');
});

// lee y devuelve las cookies enviadas en solicitud
app.get('/read-cookie', (req, res) =>{
    const cookies = req.cookies;
    res.json({ cookies });
});

// cambia valor de la cookies sessionId y extiende su fecha de exp a 7 dias
app.get('/modify-cookie', (req, res) =>{
    res.cookie('sessionId', '87654321', {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        httpOnly: true,
        secure: true
    });
    res.send('cookie modificada');
});

app.listen(3000, ()=> {
    console.log('servidor corriendo en el puerto 3000');
});
