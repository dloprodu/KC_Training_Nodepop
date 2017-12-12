'use strict';

/**
 * Base response class.
 */
class ReponseBase {
    constructor() {
        this.version = '0.0.0';
        this.status = 'success';
        this.message = 'OK';
        this.datetime = new Date().toISOString();
    }
}

module.exports = ReponseBase;