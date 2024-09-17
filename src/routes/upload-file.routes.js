const { Router } = require("express");
const { authenticateJWT } = require("../middlewares/jwt");
// metodos de controlador
const methods = require("../controllers/upload-file.controller");

// instancia router
const router = Router();

// configuramos cada endpoint con su metodo;
router.post("/upload", authenticateJWT, methods.postFile);// solo los usuarios logeados pueden cargar archivos

module.exports = router;


