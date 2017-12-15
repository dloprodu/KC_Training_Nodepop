'use strict';

require('dotenv').config();
require('./lib/mongooseConnection');

const Chance = require('chance');
const fs = require("fs");

// Instantiate Chance so it can be used
const chance = new Chance();

// JSON's
let ads = JSON.parse( fs.readFileSync("data/ads.json") );
let users = JSON.parse( fs.readFileSync("data/users.json") );

// Models
const User = require('./models/User');
const Ad = require('./models/Ad');

Ad.remove({}, (err) => {
    console.log(' + Ads removed');

    User.remove({}, (err) => {
        console.log(' + Users removed');

        createDB().then(
            () => {
                process.exit(0);
            }, 
            () => {
                process.exit(0);
            }
        );
    });
});

async function createDB() {
    let userCount = 1;
    let addCount = 1;

    for (let i = 0; i < users.length; i++) {
        const user = new User(users[i]);
        
        try {
            const userSaved = await user.save();

            console.log(`   @ User ${userSaved.name}.`);
            if (ads.length > 0) {
                const userAdsCount = (i === users.length - 1) 
                    ? ads.length 
                    : chance.integer({ min: 0,max: Math.min( 5, ads.length ) });
                const userAds = ads.splice(0, userAdsCount);
    
                for (let j = 0; j < userAds.length; j++) {
                    const ad = new Ad(userAds[j]);
    
                    ad.user = userSaved._id;
                    ad.description = chance.paragraph();
                    ad.price = chance.floating({min: 10, max: 10000, fixed: 2});
                    ad.forSale = chance.bool();
                    ad.tags = chance.pickset(Ad.getTags(), chance.integer({ min: 1, max: 3}));
    
                    try {
                        const adSaved = await ad.save();
                        console.log(`      - (${addCount++}) '${adSaved.name}'.`);
                    } catch (err) {
                        console.log('Ad error:', err);
                    }
                }
            }
        } catch (err) {
            console.log('User error:', err);
        }
    }
}