/**
 * 
 * dynReader by Chris Malcolm (C) 2018
 * 
 * Reads dyn files and parses out useful info
 * 
 */
const fs = require('fs');
const path = require('path');


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
        return Promise.all([
            // first confirm dynamo file
            this.isDynFile(f),
            // then confirm 
            new Promise((resolve, reject) => {
                fs.readFile(f, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        try {
                            this.dynDoc = JSON.parse(results);
                            resolve(this);
                        } catch (e) {
                            reject('Could not parse json from dynamo file: ' + e);
                        }
                    }
                });
            })
        ]);
    },
    visualizeNode(node) {
        nodeCopy = Object.assign({}, node);
        delete nodeCopy.Inputs;
        delete nodeCopy.Outputs;
        //node header
        console.log('\x1b[0m\x1b[43m\x1b[30m');
        console.log('Node:');
        //node main
        console.log('\x1b[0m\x1b[33m');
        console.log(JSON.stringify(nodeCopy, null, 4));
        //node input header
        console.log('\x1b[0m\x1b[44m\x1b[30m');
        console.log('Inputs:');
        //node inputs
        console.log('\x1b[0m\x1b[34m');
        console.log(JSON.stringify(node.Inputs, null, 4));
        console.log('\x1b[0m');
        //node outputs header
        console.log('\x1b[0m\x1b[41m\x1b[30m');
        console.log('Outputs:');
        //node outputs inputs
        console.log('\x1b[0m\x1b[31m');
        console.log(JSON.stringify(node.Outputs, null, 4));
        console.log('\x1b[0m');
    },
    getNodebyID(id) {
        let node = this.dynDoc.Nodes.filter( node => {
            return node.Id === id;
        })[0] || false;
        if (node) {
            node = this._parseInputsOutputs(node);
        }
        return node;
    },
    getNodesByType(type) {
        return  new Promise((resolve) => {
            const filteredNodes = this.dynDoc.Nodes.filter( node => {
                return type.toLowerCase() === node.NodeType.toLowerCase();
            }).map((node) => {
                return this._parseInputsOutputs(node);
            });

            resolve(filteredNodes);
        });
    },
    _getConnectingNode(sourceConnectorId, startOrEnd, connectionName, connectionDescription) {
      
        const connector = this.dynDoc.Connectors.filter((connectorObj) => {
            return sourceConnectorId === connectorObj[(startOrEnd === 'start') ? 'Start' : 'End'];
        })[0] || false;
        if (connector) {
            const targetConnectorId =  (startOrEnd === 'start') ?
                connector.End : //will be in a nodes input arr
                connector.Start; // will be in a nodes outputs arr
            // filter nodes where targetConnectorId is in nodes.X (inputs/outputs) arr
            let node = this.dynDoc.Nodes.filter( node => {
                return (startOrEnd === 'start') ?
                node.Inputs.map((input) => (input.Id)).indexOf(targetConnectorId) !== -1 :
                node.Outputs.map((output) => (output.Id)).indexOf(targetConnectorId) !== -1;
            })[0] || {};
            // we're going to purge inputs and outputs from this node
            if (node !== false) {
                node = Object.assign({}, node);
                ['Inputs', 'Outputs'].forEach((att) => {
                    node[att] =  node[att].length;
                    node.connectorName = connectionName;
                    node.connectorDescription = connectionDescription;
                });
            }
            return node;
        } else {
            return {};
        }
    },
    _parseInputsOutputs(node) {

        ['Inputs', 'Outputs'].forEach((attribute) => {
            if (node[attribute].length) {
                node[attribute] = node[attribute].map(({Id: connectorId, Name, Description}) => {
                    return (attribute === 'Inputs') ?
                    this._getConnectingNode(connectorId, 'end', Name, Description) :
                    this._getConnectingNode(connectorId, 'start', Name, Description);
                });
            }
        })
        return node;
    },
    
}