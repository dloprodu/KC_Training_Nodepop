'use strict';

const mongoose = require('mongoose');

const AdSchema = mongoose.Schema({
    name:        { type: String, required: [true, 'NAME_REQUIRED'], index: true },
    description: { type: String, required: [true, 'DESCRIPTION_REQUIRED'] },
    type:        { type: String, default: 'ad' },
    forSale:     { type: Boolean, default: true },
    price:       { type: Number, min: [0, 'PRICE_GTE_0'] },
    photo:       { type: String },
    tags:        { type: [String] },
    createdAt:   { type: Date, default: Date.now }
}, { collection: 'ads' }); // si no se indica collections tomara el nombre
                           // del model en minuscula y pluralizado

// Full text search index
AdSchema.index({name: 'text', description: 'text', tags: 'text'});

// Static methods
AdSchema.statics.list = (filters, skip, limit, sort, fields) => {
    const query = Agente.find(filters);

    query.skip(skip);
    query.limit(limit);
    query.sort(sort);
    query.select(fields);

    return query.exec();
};

const Ad = mongoose.model('Ad', AdSchema);

module.exports = Ad;