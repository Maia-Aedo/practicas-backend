const socketHandler = (socket) =>{
    // creamos evento message personalizado
    socket.on('message', (data) =>{
        console.log("mensaje recibido", data);

        socket.emit('message', 'su mensaje fue procesado correctamente')
    });
    socket.on("disconnect", () =>{
        console.log("usuario desconectado");
    });
};

module.exports = { socketHandler };
