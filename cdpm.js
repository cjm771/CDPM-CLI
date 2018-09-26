#!/usr/bin/env node
const dynReader = require('./lib/dynReader.js');
const program = require('commander');
const CMD_NAME = 'cdpm';

String.prototype.fixedLength = function (length=50) {
let str =this;
if (str.length > length) {
    const ellipsis = '...';
    str = str.slice(0, length - ellipsis.length) + ellipsis;
}
while (str.length < length ) {
    str += ' ';
}
return str;
}

const commands = {
    dyn: {
        description: 'Dynamo related commands',
        subCommands: {
            'py-ls' : {
                args: '<file>',
                longName: 'list-python-nodes', 
                description: 'Lists all the python nodes in file and their status',
                routine: function(file) {
                  
                }
            }, 
            'py-unpack' : {
                args: '<file>',
                longName: 'unpack-python-nodes', 
                description: 'Unpacks all python nodes'
            },
            'py-pack' : {
                args: '<file>',
                longName: 'pack-python-nodes', 
                description: 'Packs up all python nodes'
            },
            'find-nodeId': {
                args: '<file> <nodeId>',
                longName: 'find-node-by-id', 
                description: 'Find node by node id. ex: `9d5edce5bbad41ff96a0dca1b9bdd8de`',
                routine: function(file, nodeId, flags) {
                    return dynReader.load(file)
                    .then (() => {
                        // grab nodes
                        const node = dynReader.getNodebyID(nodeId);
                        if (node === false) {
                            throw 'Could not locate that id!';
                        } else {
                            dynReader.visualizeNode(node);
                        }
                    }).catch(error => {
                        console.log('Error occurred when grabbing this id: ', error);
                    })
                }
            },
            'find-nodeTypes': {
                args: '<file> <nodeType>',
                longName: 'find-node-by-type', 
                description: 'Find node by type. ex: `PythonScriptNode`',
                routine: function(file, nodeType, flags) {
                    return dynReader.load(file)
                    .then (() => {
                        // grab nodes
                        dynReader.getNodesByType(nodeType).then(nodes => {
                            nodes.forEach((node) => {
                                dynReader.visualizeNode(node);
                            })
                        }).catch(error => {
                            console.log('Error occurred when grabbing those nodes: ', error);
                        })
                    })
                    .catch((error) => {
                        console.log('Error! ' + error);
                    });
                }
            }
        }
    }
}

// start with version
program
  .version('0.0.1')
  .description('Computational Design Package Management - CLI')


// automatically create command names
Object.keys(commands).forEach(cmdGroupName => {
    const cmdGroupObj = commands[cmdGroupName];
    Object.keys(cmdGroupObj.subCommands).forEach(subcommandName => {
        const {args, longName, description, routine} = cmdGroupObj.subCommands[subcommandName];
        program
        .command(`${cmdGroupName}-${subcommandName} ${args}`)
        .description(description)
        .action(function() {
            if (routine) {
                routine.apply(null, [...arguments]);
            } else {
                console.log(`Unfortunately ${longName} isn't implemented yet!`);
            }
        });
    });
});


// catch all
program.command('*')
.action(() => {
    console.log('Operation not supported. Type `' + CMD_NAME + ' -h` for available options.');
});

//custom help
program.on('--help', function(){
    Object.keys(commands).forEach(cmdGroupName => {
        const cmdGroupObj = commands[cmdGroupName];
        console.log('');
        console.log('In depth info');
        console.log('========================');
        
        console.log('');
        console.log(`${cmdGroupObj.description}`);
        console.log(`-----------------------`);
        console.log('');
        Object.keys(cmdGroupObj.subCommands).forEach(subcommandName => {
            const {args, longName, description} = cmdGroupObj.subCommands[subcommandName];
            console.log(`${
                (CMD_NAME + ' ' + 
                cmdGroupName + '-' + 
                subcommandName + ' ' + 
                (args || ''))
            .fixedLength(60)} ${description}`);
        });
        console.log('');
        console.log('');
    });
});


program.parse(process.argv);