const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { check, body, validationResult } = require('express-validator/check');

const User = require('../../../models/User');

/**
 * POST /signup
 * Sign up.
 */ 
router.post('/signup', (req, res, next) => {
  const user = new User(req.body);

  user.save((err, userSaved ) => {
      if (err) {
          next(err);
          return;
      }

      res.json({ success: true });
  });
});

/**
 * POST /signup
 * Log in.
 */ 
router.post('/login', [
    body('email').isEmail().withMessage('EMAIL_NOT_VALID')
], async (req, res, next) => {
    try {
        validationResult(req).throw();
    
        const email = req.body.email;
        const password = req.body.password;
    
        const user = await User.findOne({ email: email }).exec();

        if (!user || !await User.comparePassword(password, user.password)) {
            res.status = 401;
            res.json({ error: 'Credenciales incorrectas' });
            return;
        }
    
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
    } catch (err) {
        next(err);
    }
});


module.exports = router;