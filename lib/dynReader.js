/**
 * 
 * dynReader by Chris Malcolm (C) 2019
 * 
 * Reads dyn files and parses out useful info
 * 
 */
const promisify = require('util').promisify;
const fs = require('fs');
const path = require('path');

class Node {
    constructor(main, inputs, outputs) {
        this.inputs = [];
        this.outputs = [];
    }
}

module.exports = {
    isDynFile: function(f) {
        return new Promise((resolve, reject) => {
            if (path.extname(f) !== '.dyn') {
             reject('Must be a *.dyn file..got ' + path.extname(f));   
            } else {
                fs.stat(f, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            }
        })
    },
    load: function(f) {
        this.dynDoc = '';
        // get file and read it
        promisify(fs.readFile(f)).then((contents) => {
            this.dynDoc = contents;
            console.log('contents read!', this.dynDoc);
        }).catch((error) => {
            console.error('error occurred while reading: ', error);
        })
    },
    findScriptTags() {
        // get script tags
    },
    getNodebyID(id) {

    },
    getNodesByType(type) {

    },
    _parseInputsOutputs(inputsOutputs) {
        
    },
    
}