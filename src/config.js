// traemos todos los metodos de la lib dotenv
const { config } = require("dotenv");
config();

// conexion con el servidor
module.exports = {
    // exportamos para que se consuma por todo el proyecto
    host: process.env.db_host,
    port: process.env.db_port,
    database: process.env.db_database,
    user: process.env.db_user,
    password: process.env.db_password,
    secretKey: process.env.secret_seed,
};
