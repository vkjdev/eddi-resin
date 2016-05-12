'use strict';
const fs = require('fs');

function read(path){
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if(err) return reject(err);
			resolve(data);
		})
	});
}

function write(path, data){
	return new Promise((resolve, reject) => {
		fs.writeFile(path, `${data}`, (err, data) => {
			if(err) return reject(err);
			resolve(data);
		});
	});
}

function stats(path){
	return new Promise((resolve, reject) => {
		fs.stats(path, (err, data) => {
			if(err) return reject(err);
			resolve(data);
		});
	});
}

module.exports = {
    read : read,
    write : write,
    stats : stats
};