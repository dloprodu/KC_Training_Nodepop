'use strict';

const ResponseBase = require('../../responseBase');

/**
 * Response class.
 */
class Response extends ResponseBase {
    constructor() {
        super();

        this.version = '1.0.0';
    }
}

module.exports = Response;