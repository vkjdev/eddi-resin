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
    ANALOG = {
        a0 : '0',
        a1 : '1',
        a2 : '2',
        a3 : '5',
        a4 : '6',
        a5 : '7'
    },
    TYPES = {
        digital : 'digital',
        analog : 'analog'
    },
    DIGITAL_TYPES = {
        1 : 'HIGH',
        0 : 'LOW'
    };
   
// create pin path 
function createAnalogPath(pin){
    return `/sys/devices/12d10000.adc/iio:device0/in_voltage${pin}_raw`;
}

function createGpioPath(pin){
    return `${GPIO_ROOT}/gpio${pin}/value`;
}

function read(pin){
    pin = pin.toLowerCase();
    let filePath,
        promise;
    if(GPIO[pin]) {
        filePath = createGpioPath(GPIO[pin]);
        promise = fsPromises.read(filePath).then(value => [TYPES.digital, value.trim()]);
    }
    else if(ANALOG[pin.toLowerCase()]) {
        filePath = createAnalogPath(ANALOG[pin]);
        promise = fsPromises.read(filePath).then(value => [TYPES.analog, value.trim()]);
    }
    else throw new Error(`Pin ${pin} is not a valid gpio or analog pin`);
    
    return promise;
}

const pin = process.argv[2];

read(pin)
    .then(data => {
        const type = data[0],
            value = data[1];
        
        console.log('raw', value);
        let calculated;
        if(type === TYPES.analog) calculated = parseInt(value) * 2 * 0.439453125;
        else calculated = DIGITAL_TYPES[type];
        
        console.log(`${type} read on pin ${pin}: raw is "${value}", calculated is "${calculated}"`)
    })
    .catch(err => console.error('ERROR:', err));