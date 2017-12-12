'use strict';

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

router.post('/', (req, res, next) => {
    // recogemos credenciales
    const email = req.body.email;
    const password = req.body.password;

    // buscamos en la base de datos el usuario ...
    // ...
    if (email !== 'user@example.com' || password !== '1234') {
        res.status = 401;
        res.json({ error: 'Credenciales incorrectas' });
        return;
    }

    // si el usuario existe y la password coincide
    // creamos un token y lo devolvemos
    // crear un objeto solo con lo mínimo
    const user = {
        _id: '123456'
    };

    jwt.sign(
        {
            user_id: user._id
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRESIN
        },
        (err, token) => {
            if (err) {
                next(err);
                return;
            }

            res.json({ success: true, token: token});
        }
    );

});

module.exports = router;