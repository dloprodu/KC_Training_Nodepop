'use strict';

const NodepopResponse = require('./NodepopResponse');

/**
 * Data response class.
 */
class NodepopDataResponse extends NodepopResponse {
    constructor(data) {
        super();

        this.data = data;
    }
}

module.exports = NodepopDataResponse;