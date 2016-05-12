'use strict';
const fsPromises = require('../modules/fs-promises');

const GPIO_ROOT = '/sys/class/gpio',
    GPIO = {
        2 : 8,
        3 : 9,
        4 : 10,
        7 : 11,
        8 : 12,
        9 : 13,
        10 : 14,
        11 : 16,
        12 : 21,
        13 : 22
    },
    POSSIBLES = {
        high : 1,
        low : 0,
        1 : 1, 
        0 : 0
    };
    
// create pin path
function createGpioDirPath(pin){
    return `${GPIO_ROOT}/gpio${pin}`;
}

// 

function write(pin, value){
    const actualPin = GPIO[pin],
        actualValue = POSSIBLES[value.toLowerCase()];
    if(!actualPin) throw new Error(`Pin ${pin} is not a valid gpio pin`);
    if(!actualValue) throw new Error(`${value} is not a valid gpio value`);
    const valuePath = `${createGpioDirPath(actualPin)}/value`;
    return fsPromises.write(valuePath, actualValue)
        .then(() => fsPromises.read(valuePath));
}

const pin = process.argv[2],
    value = process.argv[3];
    
write(pin, value)
    .then(readValue => console.log(`Pin ${pin} successfully written to ${value}: Current value is ${readValue}`))
    .catch(err => console.error('ERROR :', err));