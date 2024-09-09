/* importamos mysql/promise, se encarga de abrir un pool de conexion para la bd
le va a dar una query y recibe un resultado devolviendolo como obj
cada pool de conexion es unica, abriendose para obtener datos y cerrandose despues de obtenerlos */
const mysql = require('mysql2/promise');
const config = require('././config');

// generamos la conexion
const connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
});

const getConnection = () => {
    console.log("conectar a la base de datos");
    return connection;
};

// obtiene la conexion y retorna
module.exports = { getConnection };
