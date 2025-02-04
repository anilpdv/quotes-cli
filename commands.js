#!/usr/bin/env node
/**
 * index.js
 *
 * CLI entry point for the Quotes CLI application.
 * Uses Commander to define and route commands.
 */

import { Command } from "commander";
import chalk from "chalk";
import {
  requestQuotes,
  requestBulkQuotes,
  requestBulkQuotesByTag,
  requestBulkQuotesBySearch,
} from "./src/routes.data.js";

const program = new Command();

program.version("1.1.0").description("A beautifully styled quotes CLI");

// Command: Get a single random quote
program
  .command("quote")
  .alias("q")
  .description("Get a random quote")
  .action(async () => {
    await requestQuotes(null, null);
  });

// Command: Get a single random quote by tag
program
  .command("tag <name>")
  .alias("t")
  .description("Get a random quote from a tag")
  .action(async (name) => {
    if (name) {
      await requestQuotes("tag", name);
    } else {
      console.log(chalk.red("Tag name is required."));
    }
  });

// Command: Get a single random quote by search query
program
  .command("search <name>")
  .alias("s")
  .description("Get a random quote from a search query")
  .action(async (name) => {
    if (name) {
      await requestQuotes("search", name);
    } else {
      console.log(chalk.red("Search term is required."));
    }
  });

// Command: Get multiple random quotes (bulk, max 10)
program
  .command("bulk <number>")
  .alias("b")
  .description("Get a list of quotes (max 10)")
  .action(async (number) => {
    const count = parseInt(number, 10);
    if (isNaN(count) || count <= 0) {
      console.log(chalk.red("Please provide a valid number greater than 0."));
    } else {
      await requestBulkQuotes(Math.min(count, 10));
    }
  });

// Command: Get multiple quotes by tag (bulk, max 10)
program
  .command("bulk-tag <name> <number>")
  .alias("bt")
  .description("Get a list of quotes from a tag (max 10)")
  .action(async (name, number) => {
    const count = parseInt(number, 10);
    if (isNaN(count) || count <= 0) {
      console.log(chalk.red("Please provide a valid number greater than 0."));
    } else {
      await requestBulkQuotesByTag(name, Math.min(count, 10));
    }
  });

// Command: Get multiple quotes by search query (bulk, max 10)
program
  .command("bulk-search <name> <number>")
  .alias("bs")
  .description("Get a list of quotes from a search query (max 10)")
  .action(async (name, number) => {
    const count = parseInt(number, 10);
    if (isNaN(count) || count <= 0) {
      console.log(chalk.red("Please provide a valid number greater than 0."));
    } else {
      await requestBulkQuotesBySearch(name, Math.min(count, 10));
    }
  });

program.parse(process.argv);
