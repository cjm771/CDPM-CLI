const fs = require('fs');
const Promise = require('bluebird');


module.exports = {
  dirsExists: function(dirs) {
    return this.filesExists(dirs);
  },
  dirExists: function(dir) {
    return this.fileExists(dir);
  },
  filesExists: function(files) {
    return Promise.all(files.map((file) => {
      // any errors we want to catch
      return this.fileExists(file).catch((error) => {
        return error;
      });
    }));
  },
  fileExists: function(file) {
    return new Promise((resolve) => {
      if (file.trim() === '') {
        return resolve(false);
      } else {
        fs.access(file, (err) => {
          if (err) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      }
    });
  }
}