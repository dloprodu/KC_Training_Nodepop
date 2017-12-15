'use strict';

const fs = require("fs");

const i18n = JSON.parse( fs.readFileSync("i18n/i18n.json") );

/**
 * Translates the token for the language given.
 * @param {string} token 
 * @param {string} lang 
 */
function translate( token, lang ) {
    if (!token || !lang) {
        return '';
    }

    let path = token.split('.');
    let value = i18n[lang];
    
    do {
        value = value[path.shift()];
    } while(value && path.length);
    
    return (typeof value === 'string')
        ? value
        : token;
}

module.exports = translate;