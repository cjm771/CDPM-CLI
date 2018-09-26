#!/usr/bin/env node
const dynReader = require('./lib/dynReader.js');
const program = require('commander');
const CMD_NAME = 'cdpm';

const commands = {
    dyn: {
        description: 'Dynamo related commands',
        subCommands: {
            'py-ls' : {
                args: false,
                longName: 'list-python-nodes', 
                description: 'Lists all the python nodes in file and their status',
                routine: (file) => {
                    dynReader.isDynFile(file).then( (isFile) => {
                        console.log('congrats we doin this!');
                    }).catch((error) => {
                        console.log(file + ' is not a valid dynamo file! ' + error);
                    });
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
            }
        }
    }
}

// start with version
program
  .version('0.0.1')
  .description('Computational Design Package Management - CLI')


program
.command('dyn <dynCmd> <file>')
.description(`Dynamo related routines.`)
.action((dynCmd, file, flags) => {
    if (commands.dyn.subCommands[dynCmd] && commands.dyn.subCommands[dynCmd].routine) {
        commands.dyn.subCommands[dynCmd].routine(file, flags);
    } else if (commands.dyn.subCommands[dynCmd]) {
        console.log(`Unfortunately ${commands.dyn.subCommands[dynCmd].longName} isn't implemented yet!`);
    }
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
            console.log(`${CMD_NAME} ${cmdGroupName} ${subcommandName} ${args || ''} \t${description}`);
        });
        console.log('');
        console.log('');
    });
});



program.parse(process.argv);