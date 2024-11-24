#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const { requestQuotes, requestBulkQuotes } = require('./src/routes.data');

program.version('1.0.6').description('quotes-cli');

// Generates a random quote
program
    .command('quote')
    .alias('q')
    .description(chalk.blue('Get a random quote'))
    .action(async () => {
        await requestQuotes(null, null);
    });

// Generates a random quote from a specified tag
program
    .command('tag <name>')
    .alias('t')
    .description(chalk.blue('Get a random quote from a tag'))
    .action(async (name) => {
        if (name) {
            await requestQuotes('tag', name);
        } else {
            console.log(chalk.red('Tag name is required.'));
        }
    });

// Generates a random quote from a search query
program
    .command('search <name>')
    .alias('s')
    .description(chalk.blue('Get a random quote from an author or book'))
    .action(async (name) => {
        if (name) {
            await requestQuotes('search', name);
        } else {
            console.log(chalk.red('Search term is required.'));
        }
    });

// Generates a list of quotes
program
    .command('bulk <number>')
    .alias('b')
    .description(chalk.blue('Get a list of quotes (max 10)'))
    .action(async (number) => {
        const count = parseInt(number, 10);
        if (isNaN(count) || count <= 0) {
            console.log(chalk.red('Please provide a valid number greater than 0.'));
        } else {
            await requestBulkQuotes(Math.min(count, 10));
        }
    });

program.parse(process.argv);
