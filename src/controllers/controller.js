// traemos funcion para gestionar conexion con bd
const { getConnection } = require('../database');
const bcrypt = require('bcrypt');

// SUBIDA DE ARCHIVOS
const { request, response } = require('express');
const { uploadFiles } = require('../helpers/uploader');

// usamos como parametro la req del cliente y resp del servidor
const getOne = async(req = request, res = response) => {
    // por medio de id, devuelve un user determinado | solicitamos mediante los params del req, el id
    // al colocarlo entre {} usamos desestructuracion del obj
    const { id } = req.params;
    // sino, se puede usar
    // const id = req.params.id;

    // tratar errores
    if(!id){
        res.status(404).json({ ok:false, msg: 'El parámetro no fue provisto'});
    }

    // cosulta a BD con try&catch por si ocurre algun error
    try{
        const connection = await getConnection();
        // guardamos los datos | desestructuracion con []
        // usamos connection (instancia de getConnection) para acceder a funciones de mysql2
        const [result] = await connection.query(
            // ? actua como marcador de posicion para un param q sera reemplazado con id
            "SELECT * FROM users WHERE id = ?",
            id
        );
        res.status(200).json({ ok: true, result, msg: "approved" });
    } catch(error){
        console.error(e);
        res.status(500).json({ ok: false, msg: "error en servidor" });
    }
}

const register = async(req = request, res = response) => {
    // obtenemos usuario aplicando desestructuracion
    const user = { ...req.body };
    // valor aleatorio para hasheo
    const salt = 12;

    if(!user) res.status(401).json({ok: false, msg: "no autorizado"});

    try{
        // cambiamos la contraseña de user por la nueva hasheada
        user.password = await bcrypt.hash(user.password, salt);
        // creamos instancia de bd
        const connection = await getConnection();
        // pasamos la quey
        const result = await connection.query('INSERT INTO users SET ?', user);
        
        res.status(201).json({ok: true, result, msg: "aprobado"});
    } catch(e){
        console.log(e);
        res.status(500).json({ok: false, e, msg: "error en servidor "});
    }
};

const login = async(req = request, res = response) => {
    // obtenemos user
    const user = { ...req.body };
    // sino existe, muestra error
    if(!user) res.status(401).json({ok: false, msg: "no autorizado"})
    
    // consultamos bd por username
    try{
        const connection = await getConnection();
        const [result] = await connection.query(
            'SELECT * FROM users WHERE username = ?',
            user.username
        );
        // si la consult no devuelve nada, error
        if(!result[0]) res.status(404).json({ok: false, msg: "usuario no encontrado"});
        // compare retorna boolean dependiendo si la contraseña es correcta o no
        const isPassword = await bcrypt.compare(user.password, result[0].password);

        if(isPassword){
            // si es correcta, genera el token, enviando obj user como argumento
            const token = await generateJwt(result[0]);
            res.status(200).json({ok: true, token, msg: "login"});
        }else{
            res.status(401).json({ok: false, msg: "contraseña incorrecta"});
        }
    }catch(e){
        console.error(e);
        res.status(500).json({ok: false, e, msg: "error en servidor"});
    }
};

// exportamos todas las funciones
module.exports = { register, login, getOne}

const postFile = async(req = request, res = response) => {
    try{
        // req.files es el encargado de traer archivos, verificamos que no este vacio
        if(!req.files || Object.keys(req.files).length === 0 || !req.files.file){
            // si no tiene archivo, 204 indica que no hay contenido
            res.status(204).send("no se subieron archivos");
            return;
        }

        // obtener nombre del archivo
        const img_id = await uploadFiles(req.files);
        // creamos el objeto
        const record = { img_id: img_id };
        res.status(200).json({ok: true, record, msg: "subido con exito"});
    } catch(err) {
        console.error(err);
        res.status(404).json({ok: false, err});
    }
};

module.exports = { postFile };
