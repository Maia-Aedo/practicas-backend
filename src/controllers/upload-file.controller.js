// SUBIDA DE ARCHIVOS
const { request, response } = require("express");
const { uploadFiles } = require("../helpers/uploader");

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