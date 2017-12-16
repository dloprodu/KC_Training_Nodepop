'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TAGS = ['work', 'lifestyle', 'motor', 'mobile'];

const AdSchema = mongoose.Schema({
    type: { type: String, default: 'ad' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { 
        type: String, 
        required: [true, 'NAME_REQUIRED'], 
        minLength: [3, 'NAME_TOO_SHORT'], 
        maxLength: [255, 'NAME_TOO_LONG'], 
        index: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, 'DESCRIPTION_REQUIRED'], 
        maxLength: [1024, 'DESCRIPTION_TOO_LONG'] 
    },
    forSale: { type: Boolean, default: true },
    price: { type: Number, min: [0, 'PRICE_GTE_0'] },
    photo: { type: String },
    tags: { 
        type: [{type: String, enum: { values: TAGS, message: 'UNKNOWN_TAG'} }],
        validate: {
            validator: function(v) {
                return (v && v.length > 0);
            },
            message: 'AT_LEAST_ONE_TAG'
        }
    },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'ads' }); // si no se indica collections tomara el nombre
                           // del model en minuscula y pluralizado

//#region Indexes

// Full text search index
AdSchema.index({name: 'text', description: 'text', tags: 'text'});

//#endregion

//#region Static Methods

/**
 * Returns avaiables tag list.
 * @return {Array} Tag lit.
 */
AdSchema.statics.getTags = () => {
    return TAGS.slice();;
};

/**
 * Retuns ads list.
 * @param filters
 *  - tag
 *  - forSale: false | true
 *  - price: 0-50 | 10- | -50 | 50
 *  - name: Regex /^name/i
 * @param page
 * @param per_page
 * @param sort
 * @param fields
 */
AdSchema.statics.list = async (filters, page, per_page, sort, fields) => {
    // Remove undefine filters
    for (let key in filters) {
        if (!filters[key]) {
            delete filters[key];
            continue;
        }

        switch (key) {
            case 'price':
                const range = filters[key].split('-');
                if (range.length == 1) {
                    filters[key] = range[0];
                } else if (!range[0]) {
                    filters[key] = { $lte: range[1] };
                } else if (!range[1]) {
                    filters[key] = { $gte: range[0] };
                } else {
                    filters[key] = { $gte: range[0], $lte: range[1] };
                }
                break;

            case 'name':
                filters[key] = new RegExp('^' + filters[key], 'i');
                break;

            case 'tags':
                filters[key] = { $in: filters[key].split(',') };
                //delete filters[key];
                break;
        }
    }

    const count = await Ad.find(filters).count();
    const query = Ad.find(filters);

    query.skip(page);
    query.limit(per_page);
    query.sort(sort);
    query.select(fields);

    return { total: count, rows: await query.exec() };
};

//#endregion

//#region Hooks

AdSchema.pre('save', function(next) {
    var ad = this;
    
    // TODO: remove duplicate tags

    next();
});

//#endregion

const Ad = mongoose.model('Ad', AdSchema);

module.exports = Ad;