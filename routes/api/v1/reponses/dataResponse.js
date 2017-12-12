'use strict';

const Response = require('./response');

/**
 * Data response class.
 */
class DataResponse extends Response {
    constructor(data) {
        super();

        this.data = data;
        this.status = 'success';
        this.message = 'OK';
    }
}

module.exports = Response;