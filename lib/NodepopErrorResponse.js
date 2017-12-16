'use strict';

const NodepopResponse = require('./NodepopResponse');

/**
 * Nodepop erro response class.
 */
class NodepopErrorResponse extends NodepopResponse {
    constructor(err) {
        super();

        this.error = err.message;
        this.status = 'error';
        this.message = err.errorType ? err.errorType : 'Unknown error';
    }
}

module.exports = NodepopErrorResponse;