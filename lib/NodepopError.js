/**
 * @module NodeopoError
 * @description Defines a custom error for nodeapi.
 * @author David López Rguez
 */

'use strict';

const i18n = require('../i18n/i18n');

/**
 * Nodeopo custom error.
 */
class NodeopoError extends Error {
    constructor(err, lang = 'en', toJSON = true) {
        super(err.message);

        this.innerError = err;
        this.lang = lang;
        this.toJSON = toJSON;
        this.status = 500;
        this.errorType = 'Unknown error';

        this.formatExpressValidatorErrors();
        this.formatMongooseErrors();
    }

    /**
     * Formats the errors throw by express-validator.
     * @param {Error} err 
     * @param {Request} req 
     */
    formatExpressValidatorErrors(err, req) {
        // Los errores que genera express-validator
        // tienen una función array.
        if (!this.innerError.array) {
            return;
        }
    
        this.status = 422;
        this.errorType = 'Query params error';
    
        if (!this.toJSON) {
            const errInfo = this.innerError.array({ onlyFirstError: true })[0];
            this.message = `Not valid - ${ errInfo.param } ${ errInfo.msg }`;
            return;
        }
    
        let errors = {};
        this.innerError.array().forEach((e) => {
            errors[e.param] = i18n( `errors.${e.msg}`, this.lang );
        });
    
        this.message = errors;
    }
  
    /**
     * Formats the errors throw by mongoose models.
     * @param {Error} err 
     * @param {Request} req 
     */
    formatMongooseErrors(err, req) {
        // Los errores que genera Mongoose tienen un
        // array errors
        if (!this.innerError.errors) {
            return;
        }
    
        this.status = 422;
        this.errorType = 'Model validation error';
    
        if (!this.toJSON) {
            return;
        }
    
        let errors = {};
        for (let path in this.innerError.errors) {
            errors[path] = i18n( `errors.${this.innerError.errors[path].message}`, this.lang );
        };
    
        this.message = errors;
    }
}

module.exports = NodeopoError;