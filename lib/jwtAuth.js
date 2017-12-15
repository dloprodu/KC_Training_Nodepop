'use strict';

const jwt = require('jsonwebtoken');

// Middlewares de authenticación
module.exports = () => {
    return function (req, res, next) {
        // leer credenciales
        const token = req.body.token || req.query.token || req.get('x-access-token');

        if (!token) {
            const err = new Error('No token provided');
            err.status = 401;
            next(err);
            return;
        }

        // comprobar credenciales
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                const err = new Error('Invalid token');
                err.status = 401;
                next(err);
                return;
            }

            // guardamos info en la request para los siguientes middlewares
            req.userId = decoded.user_id;

            // continuar llamando a next
            next();
        });
    };
};