'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = mongoose.Schema({
    name:      { type: String, required: [true, 'NAME_REQUIRED'], index: true },
    type:      { type: String, default: 'user' },
    thumbnail: { type: String },
    email:     { 
        type: String, 
        required: [true, 'EMAIL_REQUIRED'], 
        validate: {
            validator: function(v) {
              return validator.isEmail(v);
            },
            message: 'EMAIL_NOT_VALID'
        },
        index: true, 
        unique: true 
    },
    password:  { type: String, required: [true, 'PASSWORD_REQUIRED'] },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'users' }); // si no se indica collections tomara el nombre
                             // del model en minuscula y pluralizado

// Static methods
UserSchema.statics.list = (filters, skip, limit, sort, fields) => {
    const query = Agente.find(filters);

    query.skip(skip);
    query.limit(limit);
    query.sort(sort);
    query.select(fields);

    return query.exec();
};

// Instance methods
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, match) {
        if (err) { 
            return callback(err) 
        };

        callback(null, match);
    });
};

// Hooks
UserSchema.pre('save', function(next) {
    // do stuff
    var user = this;
    
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(process.env.SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
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