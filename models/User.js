'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = mongoose.Schema({
    type: { type: String, default: 'user' },
    name: { 
        type: String, 
        required: [true, 'NAME_REQUIRED'], 
        minLength: [3, 'NAME_TOO_SHORT'], 
        maxLength: [255, 'NAME_TOO_LONG'], 
        trim: true, 
        index: true 
    },
    gender: { 
        type: String, 
        require: [true, 'GENDER_REQUIRED'], 
        enum: { values: ['male', 'female'], message: 'UNKNOWN_GENDER' } 
    },
    thumbnail: { type: String },
    email: { 
        type: String, 
        required: [true, 'EMAIL_REQUIRED'], 
        validate: {
            validator: function(v) {
              return validator.isEmail(v);
            },
            message: 'EMAIL_NOT_VALID'
        },
        trim: true,
        index: true, 
        unique: true 
    },
    password: { type: String, required: [true, 'PASSWORD_REQUIRED'] },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'users' }); // si no se indica collections tomara el nombre
                             // del model en minuscula y pluralizado

// Static methods
UserSchema.statics.comparePassword = async (candidatePassword, hash) => {
    const match = await bcrypt.compare(candidatePassword, hash);
    return match;
};

// Hooks
UserSchema.pre('save', (next) => {
    var user = this;
    
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(parseInt( process.env.SALT_WORK_FACTOR ), (err, salt) => {
        if (err) {
            return next(err);
        }

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;