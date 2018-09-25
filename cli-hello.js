#!/usr/bin/env node

const program = require('commander');

// start with version
program
  .version('0.0.1')
  .description('hello world')

// here are some commands
program
.command('helloWorld')
.alias('hw')
.description('echos hello world..')
.action(() => {
    console.log('hello world!')
});

// here's another
program
.command('hello <name>')
.alias('h')
.option('-!, --exclaim', 'exclaim it brah!')
.option('-?, --question', 'question it brah?')
.description('echos hello to persons name')
.action((name, cmd) => {
    let suffix = '';
    if (cmd.exclaim) {
        suffix += '!';
    }
    if (cmd.question) {
        suffix += '?';
    }
    console.log(`Hello ${name}${suffix}`);
});


program.parse(process.argv);