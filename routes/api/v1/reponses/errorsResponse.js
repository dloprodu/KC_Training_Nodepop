'use strict';

const Response = require('./response');

/**
 * Erross response class.
 */
class ErrorResponse extends Response {
    constructor(erros) {
        super();

        this.erros = errors;
        this.status = 'error';
        this.message = 'error';
    }
}

module.exports = ErrorResponse;