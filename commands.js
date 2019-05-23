#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const {request_quotes, request_quotes_bulk} = require('./src/routes.data');
program.version('1.0.2').description('quotes-cli');

// : generates random quote
program
  .command('quotes')
  .alias('q')
  .description(chalk.blue('Get random quote'))
  .action(() => {
    request_quotes(null, null);
  });

// : generate random quote from specified tag
program
  .command('tag <name>')
  .alias('t')
  .description(chalk.blue('Get random quoute from a tag'))
  .action(name => {
    if (name) {
      request_quotes('tag', name);
    } else {
      console.log('requires tag name');
    }
  });

program
  .command('search <name>')
  .alias('s')
  .description(chalk.blue('Get random quote from author or book'))
  .action(name => {
    if (name) {
      request_quotes('search', name);
    } else {
      console.log('requires search name');
    }
  });

// ------------------------------
// ---- Bulk list of quotes -----
// ------------------------------
program
  .command('bulk <nu>')
  .alias('b')
  .description('Get list of quotes max[10] specify the number.')
  .action(nu => {
    request_quotes_bulk(nu);
  });

program.parse(process.argv);
