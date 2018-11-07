/**
 * 
 * cliUtils by Chris Malcolm (C) 2018
 * 
 * Useful node cli tools
 * 
 */
module.exports = {
  colorDic: {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    FgBlack: "\x1b[30m",
    FgGrey: "\x1b[90m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
  },
  _colorString: function(str, color) {
    if ( this.colorDic[color] !== undefined) {
      str =  this.colorDic[color] + str;
    }
    str += this.colorDic.Reset;
    return str;
  },
  // for prototype extension
  stringLogColorize: function () {
    // color dictionary
    const colorDic = this.colorDic;
    // color string func
    const colorString = this._colorString.bind(this);
    String.prototype.logColorize =  function(colorizer) {
      let str = this;
      // supply a string for single color..
      if (typeof colorizer === 'string') {
        return colorString(str, colorizer);
      } else {
        // if object is supplied it acts as a conditional based on value
        // {colorKey: stringCondition}
        Object.keys(colorizer).forEach((colorKey) => {
          stringVal = colorizer[colorKey];
          if (str.toString() === stringVal.toString() && colorDic[colorKey] !== undefined) {
            str = colorString(str, colorKey);
          }
        });
        return str;
      }
    }
  },

  stringLogUnColorize: function() {
    const colorDic = this.colorDic;
    String.prototype.logUnColorize = function () {
      let str = this;
      Object.keys(colorDic).forEach((colorizer) => {
        if ( colorDic[colorizer] !== undefined) {
          str =  str.replace(new RegExp( colorDic[colorizer].replace(/\[/g, '\\['), 'g'), '');
        }
      });
      return str;
    }
  },

  tableRowCreate: function (cells, widths, fill=' ') {
    this.stringFixedLength();
    return cells.reduce((combined, currVal, currIndex) => {
      return combined += currVal.fixedLength(widths[currIndex], fill) + ' ';
    },'');
  },

    //for prototype extension
    stringFixedLength: function () {
      this.stringLogUnColorize();
      String.prototype.fixedLength = function (length = 50, fill = ' ') {
        let str = this;
        str = str;
        if (str.logUnColorize().length > length) {
          const ellipsis = '...        ';
          str = str.slice(0, length - ellipsis.length) + ellipsis;
        }
        while (str.logUnColorize().length < length) {
          str += fill;
        }
        return str;
      }
  }
};
