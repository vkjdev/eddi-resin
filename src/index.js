'use strict';
const mqtt = require('mqtt'),
    path = require('path');
    
const config = require('./config');
    
const KEY_PATH = path.resolve(__dirname, '../keys/key.pem'),
    CSR_PATH = path.resolve(__dirname, '../keys/csr.pem'),
    PORT = 8883,
    EVENTS = {
        connect : 'connect',
        reconnect : 'reconnect',
        close : 'close',
        offline : 'offline',
        error : 'error',
        message : 'message'
    },
    TOPIC = {
        errors : `errors/${config.DEVICE_ID}`,
        messages : `messages/${config.DEVICE_ID}`,
        presence : 'presence'
    },
    KEYS = {
        salinityIn : 'SALINITY_IN',
        salinityOut : 'SALINITY_OUT',
        flowOut : 'FLOW_OUT',
        power : 'POWER_IN',
        salinityDump : 'SALINITY_DUMP'
    },
    clientOptions = {
        username : config.DEVICE_ID,
        password : config.DEVICE_TOKEN,
        keyPath : KEY_PATH,
        certPath : CSR_PATH,
        // port : PORT,
        // host : config.CLOUD_URL,
        // rejectUnauthorized : false
    };
    
const client = mqtt.connect(config.CLOUD_URL, clientOptions),
    data = {
        [KEYS.power] : 357,
        [KEYS.flowOut] : 657.91,
        SALINITY:{
            [KEYS.salinityDump] : 618,
            [KEYS.salinityIn] : 384,
            [KEYS.salinityOut] : 711,
        }
            
    },
    message = data;
    

// client.subscribe('messages');
// client.publish('messages', 'Current time is: ' + new Date());
// client.on('message', function(topic, message) {
//   console.log(message);
// });

// client.on('connect', function(){
// 	console.log('Connected');
// });

console.log('client', client)
    
client.subscribe(TOPIC.errors);
client.subscribe('messages');
// client.subscribe(TOPIC.presence);

Object.keys(EVENTS).forEach(event => {
    client.on(event, function(){
        if(event === EVENTS.message) return;
        console.log(`event ${event} : ${JSON.stringify([].slice.call(arguments))}`)
        if(event === EVENTS.connect) publish();
    });
});


client.on(EVENTS.message, (topic, message, trigger) => {
    if(message && message.type === 'Buffer') return console.log('got message', message.data.toString('utf8'));
    console.log('got unknown message', message);
})

function publish(){
    client.publish(TOPIC.presence, JSON.stringify(message), function(){
        console.log('published message', [].slice.call(arguments));
    });
}