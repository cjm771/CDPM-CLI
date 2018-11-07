#!/usr/bin/env node
const cliUtils = require('./lib/cliUtils.js');
const dynReader = require('./lib/dynReader.js');
const pyDynUtils = require('./lib/pyDynUtils.js');
const program = require('commander');
const CMD_NAME = 'cdpm';

//prototypeExtenders
cliUtils.stringFixedLength();
cliUtils.stringLogColorize();


const PACK_COLORS = {};
['FgGreen', 'FgCyan', 'FgYellow', 'FgRed'].forEach((color, index) => {
  PACK_COLORS[color] = pyDynUtils.PACK_STATUS[Object.keys(pyDynUtils.PACK_STATUS)[index]];
});

const commands = {
  dyn: {
    description: 'Dynamo related commands',
    subCommands: {
      'py-init': {
        args: '<file>',
        longName: 'dyn-python-boilerplate',
        description: 'Creates a dynamo python boilerplate *.dyn file.'
      },
      'py-ls': {
        args: '<file>',
        longName: 'list-python-nodes',
        description: 'Lists all the python nodes in file and their status',
        routine: function (file) {
          return pyDynUtils.getDynPyNodeStatus(file).then((pythonNodes) => {
          
              // grab nodes
              // check amount of inputs should be 2. first should be a boolean, and second should be file path
              const invalidNote = 'Note: any invalid python nodes, simply mean we can\'t figure out how to pack/unpack it. ' +
                '\nThis is usually because it doesn\'t meet minimum requirements:' +
                '\n' +
                '\n    - Minimum of two inputs' +
                '\n        - input #1: boolean value (represents enabled toggle)' +
                '\n        - input #2: filepath browser (represents file path, sorry no strings)' +
                '\n';
              const packedNote = 'Another Note: We assume if the #[PACKED] or #[UNPACKED] flag isn\'t at the top of the script,' +
                '\n then we assumed its all packed up. If this isn\'t the case put this comment flag at the top of your code.';

              // notes
              console.log(['', invalidNote, packedNote, '', ''].join('\n').logColorize('FgGrey'));
              
              // define table widths
              const tableWidths  = [5, 45, 85, 10, 35];
              // headers
              console.log(cliUtils.tableRowCreate(['id', 'name', 'script_path', 'on?', 'pack_status'].map((text) => (text.logColorize('FgMagenta'))), tableWidths));
              console.log(cliUtils.tableRowCreate(['','', '', '', ''], tableWidths, '=').logColorize('FgMagenta'));
              // nodes

              pythonNodes.forEach(([name, path, active, status, pathExists], index) => {
                // colorize based on existing-ness
                path = (pathExists) ? path.logColorize('FgGreen') : path.logColorize('FgRed') ;
                const isOn = ((active === '-') ? '-'.logColorize('FgRed') : (active === true) ? 'yes'.logColorize('FgGreen') : 'no'.logColorize('FgRed'));
                console.log(cliUtils.tableRowCreate([String(index).logColorize('FgCyan'), name.logColorize('FgCyan'), path, isOn, status.logColorize(PACK_COLORS)], tableWidths));
              })
              console.log('\n');
            }).catch(error => {
              console.log('Error: ', error);
            })
        }
      },
      'py-unpack': {
        args: '<file>',
        longName: 'unpack-python-nodes',
        description: 'Unpacks all python nodes'
      },
      'py-pack': {
        args: '<file>',
        longName: 'pack-python-nodes',
        description: 'Packs up all python nodes'
      },
      'find-nodeId': {
        args: '<file> <nodeId>',
        longName: 'find-node-by-id',
        description: 'Find node by node id. ex: `9d5edce5bbad41ff96a0dca1b9bdd8de`',
        routine: function (file, nodeId, flags) {
          return dynReader.load(file)
            .then(() => {
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
        routine: function (file, nodeType, flags) {
          return dynReader.load(file)
            .then(() => {
              // grab nodes
              dynReader.getNodesByType(nodeType).forEach((node) => {
                dynReader.visualizeNode(node);
              });
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
    const { args, longName, description, routine } = cmdGroupObj.subCommands[subcommandName];
    program
      .command(`${cmdGroupName}-${subcommandName} ${args}`)
      .description(description)
      .action(function () {
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
program.on('--help', function () {
  Object.keys(commands).forEach(cmdGroupName => {
    const cmdGroupObj = commands[cmdGroupName];
    console.log('');
    console.log('In depth info'.logColorize(['BgRed']));
    console.log('========================'.logColorize(['FgRed']));

    console.log('');
    console.log(`${cmdGroupObj.description}`.logColorize(['FgCyan']));
    console.log(`-----------------------`.logColorize(['FgCyan']));
    console.log('');
    Object.keys(cmdGroupObj.subCommands).forEach(subcommandName => {
      const { args, longName, description } = cmdGroupObj.subCommands[subcommandName];
      console.log(`${
        (CMD_NAME + ' ' +
          (cmdGroupName + '-' +
            subcommandName).logColorize(['FgGreen']) + ' ' +
          (args || '')).fixedLength(60)} ${description.logColorize('FgGrey')}`);
    });
    console.log('');
    console.log('');
  });
});


program.parse(process.argv);