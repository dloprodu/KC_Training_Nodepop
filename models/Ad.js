'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdSchema = mongoose.Schema({
    type:        { type: String, default: 'ad' },
    user:        { type: Schema.Types.ObjectId, ref: 'User' },
    name:        { type: String, required: [true, 'NAME_REQUIRED'], maxLength: [255, 'NAME_TOO_LONG'], index: true, trim: true },
    description: { type: String, required: [true, 'DESCRIPTION_REQUIRED'], maxLength: [1024, 'DESCRIPTION_TOO_LONG'] },
    forSale:     { type: Boolean, default: true },
    price:       { type: Number, min: [0, 'PRICE_GTE_0'] },
    photo:       { type: String },
    tags:        { 
        type: [{type: String, enum: { values: ['work', 'lifestyle', 'motor', 'mobile'], message: 'UNKNOWN_TAG'} }],
        validate: {
            validator: function(v) {
                return (v && v.length > 0);
            },
            message: 'EMAIL_NOT_VALID'
        }
    },
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

// Hooks
AdSchema.pre('save', function(next) {
    var ad = this;
    
    // TODO: remove duplicate tags

    next();
});

const Ad = mongoose.model('Ad', AdSchema);

module.exports = Ad;