'use strict';

const NodepopDataResponse = require('./NodepopDataResponse');

/**
 * Nodepop paginated response class.
 */
class NodepopPaginatedResponse extends NodepopDataResponse {
    constructor(rows, total) {
        super(rows);

        this.total = total;
    }
}

module.exports = NodepopPaginatedResponse;