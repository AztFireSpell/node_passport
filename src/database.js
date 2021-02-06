const mysql = require('mysql');

const { database } = require('./keys');

const {promisify} = require('util');

//Especie de hilos que se ejecutan en secuencia, si en produccion hay tolerancia
//a fallos
const pool = mysql.createPool(database);

//Coolbacks no aguantan promesas, para eso usamos promisify

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connection) connection.release();
    console.log('DATABASE IS CONNECTED');
    return;

});

//Cuando hacemos consultas podemos usar promesas de JS
pool.query = promisify(pool.query);

module.exports = pool;

