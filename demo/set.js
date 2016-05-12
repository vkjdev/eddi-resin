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
        a3 : '3',
        a4 : '4',
        a5 : '5'
    },
    DIRECTION = {
        in : 'in',
        out : 'out'
    };

// create pin path
function createGpioDirPath(pin){
    return `${GPIO_ROOT}/gpio${pin}`;
}

function exportPin(pin){
    const actual = GPIO[pin];
    if(!actual) throw new Error(`Pin ${pin} is not a valid gpio pin`);
    const gpioPath = createGpioDirPath(actual);
    return fsPromises.stats(gpioPath)
            .catch(err => {
                const exportPath = `${GPIO_ROOT}/export`;
                return fsPromises.write(exportPath, actual);
            });
}

function setDirection(pin, direction){
    const actualPin = GPIO[pin],
        actualDirection = DIRECTION[direction];
    if(!actualPin) throw new Error(`Pin ${pin} is not a valid gpio pin`);
    if(!actualDirection) throw new Error(`Direction ${direction} is not a valid gpio direction`);
    const directionPath = `${createGpioDirPath(actualPin)}/direction`;
    return fsPromises.write(directionPath, actualDirection);
}

function exportSetPin(pin, direction){
    let promise = exportPin(pin);
    if(direction) promise = promise.then(() => setDirection(pin, direction));
    return promise;
}

const pin = process.argv[2],
    direction = process.argv[3] || DIRECTION.in;

exportSetPin(pin, direction)
    .then(() => console.log(`Pin ${pin} successfully exported to ${direction}`))
    .catch(err => console.error('ERROR :', err));