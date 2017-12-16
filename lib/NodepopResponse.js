'use strict';

/**
 * Nodepop base response class.
 */
class NodepopResponse {
    constructor() {
        this.version = '1.0.0';
        this.status = 'success';
        this.message = 'OK';
        this.datetime = new Date().toISOString();
    }
}

module.exports = NodepopResponse;