'use strict';
const fs = require('fs');

const options = {
	encoding : 'utf8'	
};

function read(path){
	return new Promise((resolve, reject) => {
		fs.readFile(path, options, (err, data) => {
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

function stat(path){
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, data) => {
			if(err) return reject(err);
			resolve(data);
		});
	});
}

module.exports = {
    read : read,
    write : write,
    stat : stat
};