'use strict';
const isProduction = process.env.NODE_ENV === 'production',
    prodConfig = require('./production'),
    devConfig = require('./development'),
    config = Object.assign({}, { production : isProduction }, isProduction ? prodConfig : devConfig );
    
module.exports = config;