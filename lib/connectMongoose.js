'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

conn.on('error', err => {
    console.log('Error', err);

    precess.exit(1);
});

conn.once('open', () => {
    console.log(`Conectado a MongoDB en ${mongoose.connection.name}`);
});

mongoose.connect('mongodb://localhost/cursonode', {
    useMongoClient : true
});

mongoose.Promise = global.Promise;

module.exports = conn;