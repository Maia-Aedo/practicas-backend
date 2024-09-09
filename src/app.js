const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
var cors = require('cors');

const app = express();

app.use(cors());
app.use(cookieParser());

// CONFIGS
app.set("port", 3000);
app.use(express.urlencoded({ extended: false }));
// transforma todas las peticiones en formato json
app.use(express.json());

// MIDDLEWARES
app.use(morgan("dev"));

// exportamos para que sea visible en el resto del proyecto
module.exports = app;

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


