#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { requestQuotes, requestBulkQuotes } from './src/routes.data.js';

const program = new Command();

program.version('1.1.0').description('quotes-cli');

// Generates a random quote
program
    .command('quote')
    .alias('q')
    .description('Get a random quote')
    .action(async () => {
        await requestQuotes(null, null);
    });

// Generates a random quote from a specified tag
program
    .command('tag <name>')
    .alias('t')
    .description('Get a random quote from a tag')
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
    .description('Get a random quote from an author or book')
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
    .description('Get a list of quotes (max 10)')
    .action(async (number) => {
        const count = parseInt(number, 10);
        if (isNaN(count) || count <= 0) {
            console.log(chalk.red('Please provide a valid number greater than 0.'));
        } else {
            await requestBulkQuotes(Math.min(count, 10));
        }
    });

program.parse(process.argv);
