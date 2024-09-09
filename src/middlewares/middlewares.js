/* los middlewares son funciones intermedias que actuan como interceptores de las 
requests. Su funcion principal es procesar, modificar o verificar la info de las request
antes de llegar a destino o enviar resp
JWT actuara como middleware para comprobar si el token enviado en la peticion tiene
firma valida y si es autentico */

const jwt = require('jsonwebtoken');
const config = require('../config')
const { response, request, next } = require('express');

const authenticateJWT = (req = request, res = response, next = next) => {
    // interceptamos el header de la peticion, extrayendo propiedad authorization, la cual tiene el token
    const authHeader = req.headers["authorization"];
    // con split dividimos el bearer(token), el segundo index(1) del array obtenido es el que contiene el dato
    const token = authHeader && authHeader.split(" ")[1];

    // token pasa a ser string, si es nulo devuelve error (unathorized)
    if(token == null) return res.sendStatus(401); // si no hay token devuelve err 401

    // verificamos que la firma sea correcta, verify obtiene como parametros el token y la firma
    jwt.verify(token, config.secretKey, (err, user) => {
        // si hay error en verificacion, devuelve err 403 (forbidden)
        if(err) return res.sendStatus(403);
        // si no hay error, se da ok con next permitiendo al user continuar la peticion, de ser necesario
        // guardar el usuario en el request para usar en rutas protegidas
        req.user = user;
        // pasa al siguiente middleware o ruta
        next();
    });
};

// no es middleware, gestiona el creado del token | recibe user que pasa a ser parte del payload
const generateJwt = async(user) => {
    // generamos payload con info del user
    const payload = {
        sub: user.id,
        username: user.username,
        name: user.nombre
    };

    const options = {
        // damos validez de 24h
        expiresIn: "24h"
    };
    // retornamos token para que el usuario lo use en peticiones
    return jwt.sign(payload, config.secretKey, options);
};

// exportamos las funciones
module.exports = { authenticateJWT, generateJwt };
