const app = require('./app');

// socket
const http = require('http');
// para usar socket con express, creamos servidor http
const server = http.createServer(app);
/*  adjuntamos socket al servidor creado
socket se ejecuta sobre protocolo  websocket que requiere acceso a servidor http para gestionar
conexiones en tiempo real
-1- */
const { Server }  = require('socket.io');
const io = new Server(server);

// instancia de la fx en socketHandler
const socketHandler = require('./sockets/handler.socket');

const main = () => {
    app.listen(app.get('port'));

    // recibe socket creado al conectar el user
    // -2-
    io.on('connection', (socket) => {
        console.log('usuario conectado');
        socketHandler.socketHandler(socket);
    });
    console.log(`servidor en puerto ${app.get('port')}`);
};
main();

/* 1- probamos conexion en postman (http://localhost:3000 - headers) */
/* 2- en postman ponemos el nombre del _evento_ (message) y enviamos un msj (test) 
nos suscribimos a message (listen) para luego disparar un nuevo evento */
