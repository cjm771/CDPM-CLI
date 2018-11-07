const path = require('path');
const dynReader = require('./dynReader.js');
const fsUtils = require('./fsUtils.js');

module.exports = {
  PACK_STATUS:  {
    'PACKED': 'Packed',
    'UNPACKED': 'Unpacked',
    'UNKNOWN': '? (Assuming Packed)',
    'INVALID': 'Invalid'
  },
  // based on a file return an array of arrays (python nodes) with their pack status
  getDynPyNodeStatus: function (file) {
    return dynReader.load(file)
    .then(() => {
      return dynReader.getNodesByType('PythonScriptNode').map((node) => {
        // dynReader.visualizeNode(node);
        let name, path, active, status = '';
        if (node.Inputs.length < 2 ||
          typeof node.Inputs[0].InputValue !== 'boolean' ||
          typeof node.Inputs[1].InputValue !== 'string') {
          status =  this.PACK_STATUS.INVALID;
        } else {
          // if not status is invalid inputs
          // else assume packed (if no flag..) first thing in file should be #[PACKED] or #[UNPACKED] 
          const code = node.Code.trim();
          if (code.indexOf('#[UNPACKED]') === 0) {
            status = this.PACK_STATUS.UNPACKED;
          } else if (code.indexOf('#[PACKED]') === 0) {
            status =  this.PACK_STATUS.PACKED;
          } else {
            status =  this.PACK_STATUS.UNKNOWN;
          }
        }

        // spit out external path + name..(id if no path name)
        if (!!~status.indexOf('Invalid')) {
          active = '-';
          path = '-';
          name = node.Id;
        } else {
          active = node.Inputs[0].InputValue;
          path = node.Inputs[1].InputValue;
          name = path.split(/\\|\//).pop();
        }
        return [name, path, active, status];
      });
    })
    .then(async (pythonNodes) => {
        const fileExists = await fsUtils.dirsExists(pythonNodes.map((node) => {
          return (node[1].trim() === '-') ? '' : path.dirname(node[1]);
        }));
        return pythonNodes.map((node, index) => {
          node.push(fileExists[index]);
          return node;
        });
    });
  }
}