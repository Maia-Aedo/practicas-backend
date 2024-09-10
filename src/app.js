const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
var cors = require('cors');
// permite manejar subida de archivos - facilita procesamiento de archivos enviados
// a traves de formularios con metodo post
const fileUpload = require('express-fileupload');

//routes
const users = require('./routes/users.routes')
const files = require('./routes/upload-file.routes')

// express
const app = express();
// cors
app.use(cors());
// cookies
app.use(cookieParser());

// CONFIGS
app.set("port", 3000);
app.use(express.urlencoded({ extended: false }));
// transforma todas las peticiones en formato json
app.use(express.json());

// MIDDLEWARES
app.use(morgan("dev"));

// direccion de rutas
app.use(users, files);

// fileupload
app.use(
    fileUpload({
        // los archivos subidos se manejaran como arhivos temporales, reduce uso de mem en server
        useTempFiles: true,
        // define dir donde se almacenan los archivos subidos antes de ser movidos a destino final
        tempFileDir: '/tmp/',
        // limite de tamaño de archivos | 50mb si se sube un archivo +grande, falla
        limits: { fileSize: 50 * 1024 * 1024 },
        // si el dir de destino no existe, se crea automaticamente
        createParentPath: true
    })
);

// COOKIES
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

// exportamos para que sea visible en el resto del proyecto
module.exports = app;
