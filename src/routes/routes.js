// router para usar metodos POST-PUT-GET-DELETE-PATH
const { Router } = require('express');
// metodos de controlador
const methods = require('../controllers/users.controller.js');
// autenticacion
const { authenticateJWT } = require('../middlewares/jwt');

// instancia router
const router = Router();

// configuramos cada endpoint con su metodo;
router.post('/users/register', methods.register);
router.post('/users/login', methods.login);
// :id es un path parameter, express lo divide y coloca en req.params
/* colocamos el middleware para evitar que cualquiera que consulte el endpoint vea el token
que solo se puede conseguir mediante autenticacion en login */
router.get('/users/:id', authenticateJWT, methods.getOne);

// exportamos router
module.exports = router;
