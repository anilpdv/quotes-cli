/**
 * src/routes.data.js
 *
 * Contains functions for fetching, extracting, and displaying quotes from Goodreads.
 * Uses centralized configuration, bundled dictionary files for auto-correction,
 * caching, and spinners.
 */

import axios from "axios";
import chalk from "chalk";
import clear from "clear";
import randomNumber from "random-number";
import * as cheerio from "cheerio";
import boxen from "boxen";
import gradient from "gradient-string";
import figlet from "figlet";
import ora from "ora";
import NodeCache from "node-cache";
import nspell from "nspell";
import fs from "fs";
import path from "path";

// -----------------------------------------------------------------------------
// Configuration & Constants
// -----------------------------------------------------------------------------

const CONFIG = {
  BASE_URL: "https://www.goodreads.com",
  PATHS: {
    QUOTES: "/quotes",
    TAG: "/quotes/tag", // e.g., /quotes/tag/{tag}
    SEARCH: "/quotes/search",
  },
  PAGE: {
    MIN: 1,
    MAX: 100,
  },
  CACHE_TTL: 3600, // seconds
  BOXEN_OPTIONS: {
    padding: 1,
    margin: 1,
    borderColor: "magenta",
    borderStyle: "round",
  },
  AXIOS_TIMEOUT: 5000, // milliseconds
};

// -----------------------------------------------------------------------------
// Dictionary (Auto-Correction) Initialization
// -----------------------------------------------------------------------------

// Because __dirname is not defined in ES modules, we derive it from import.meta.url:
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const dictPath = path.join(__dirname, "dictionaries");
let spellChecker = null;
try {
  const aff = fs.readFileSync(path.join(dictPath, "en_US.aff"), "utf-8");
  const dic = fs.readFileSync(path.join(dictPath, "en_US.dic"), "utf-8");
  spellChecker = nspell(aff, dic);
} catch (err) {
  console.error(
    chalk.red(
      "Could not load bundled dictionary files. Auto-correction disabled.",
    ),
    err.message,
  );
}

// -----------------------------------------------------------------------------
// Global Instances & Helper Functions
// -----------------------------------------------------------------------------

// Cache instance
const cache = new NodeCache({ stdTTL: CONFIG.CACHE_TTL });

/**
 * Corrects an input string word by word using nspell.
 *
 * @param {string} input - The input string.
 * @returns {string} - The corrected string.
 */
const correctInput = (input) => {
  if (!spellChecker) return input;
  return input
    .split(" ")
    .map((word) => {
      if (!isNaN(word) || word.length < 3) return word;
      if (spellChecker.correct(word)) return word;
      const suggestions = spellChecker.suggest(word);
      return suggestions.length ? suggestions[0] : word;
    })
    .join(" ");
};

/**
 * Returns a random page number between the configured MIN and MAX.
 *
 * @returns {number}
 */
const getRandomPage = () =>
  randomNumber({ min: CONFIG.PAGE.MIN, max: CONFIG.PAGE.MAX, integer: true });

/**
 * Returns a random index for a given array length.
 *
 * @param {number} length - Array length.
 * @returns {number}
 */
const getRandomIndex = (length) =>
  randomNumber({ min: 0, max: length - 1, integer: true });

/**
 * Builds a URL from a given path and query parameters.
 *
 * @param {string} path - The path (e.g., "/quotes").
 * @param {Object} [params={}] - The query parameters.
 * @returns {string} - The full URL.
 */
const buildUrl = (path, params = {}) => {
  const url = new URL(path, CONFIG.BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
};

// -----------------------------------------------------------------------------
// Quote Extraction & Fetching Functions
// -----------------------------------------------------------------------------

/**
 * Extracts quotes from Cheerio-loaded HTML.
 *
 * @param {CheerioStatic} $ - The Cheerio instance.
 * @returns {Array<{quote: string, author: string}>}
 */
const extractQuotes = ($) => {
  const quotes = [];

  $(".quoteText").each((_, element) => {
    const quoteElement = $(element);
    const rawQuote = quoteElement
      .contents()
      .filter((_, el) => el.type === "text")
      .first()
      .text()
      .trim();
    const cleanQuote = rawQuote.replace(/^["“”]+|["“”]+$/g, "").trim();
    const author = quoteElement.find(".authorOrTitle").first().text().trim();

    if (cleanQuote && author) {
      quotes.push({ quote: cleanQuote, author });
    }
  });

  return quotes;
};

/**
 * Fetches quotes from a given URL.
 * Uses caching and a timeout to prevent long waits.
 *
 * @param {string} url - The URL to fetch.
 * @returns {Promise<Array<{quote: string, author: string}>>}
 */
const fetchQuotes = async (url) => {
  if (cache.has(url)) {
    console.log(chalk.gray("Fetching quotes from cache..."));
    return cache.get(url);
  }
  try {
    const response = await axios.get(url, { timeout: CONFIG.AXIOS_TIMEOUT });
    const html = response.data;
    const $ = cheerio.load(html);
    const quotes = extractQuotes($);
    cache.set(url, quotes);
    return quotes;
  } catch (error) {
    console.error(chalk.red("Error fetching quotes:"), error.message);
    throw error;
  }
};

// -----------------------------------------------------------------------------
// Display Functions
// -----------------------------------------------------------------------------

/**
 * Displays the ASCII art header.
 */
const displayHeader = () => {
  clear();
  const banner = figlet.textSync("Quotes CLI", { horizontalLayout: "full" });
  console.log(gradient.pastel.multiline(banner));
  console.log("\n");
};

/**
 * Displays a single quote in a styled box.
 *
 * @param {{quote: string, author: string}} quoteObj - The quote object.
 */
const displayQuote = (quoteObj) => {
  displayHeader();

  const quoteGradient = gradient(["#A1C4FD", "#C2E9FB"]);
  const authorGradient = gradient(["#00F260", "#0575E6"]);

  const quoteText = quoteGradient(`"${quoteObj.quote}"`);
  const authorText = chalk.italic(authorGradient(`- ${quoteObj.author}`));
  const fullQuote = `${quoteText}\n\n${authorText}`;

  console.log(boxen(fullQuote, CONFIG.BOXEN_OPTIONS));
};

/**
 * Displays multiple quotes.
 *
 * @param {Array<{quote: string, author: string}>} quotes - An array of quote objects.
 */
const displayQuotes = (quotes) => {
  displayHeader();

  const quoteGradient = gradient(["#A1C4FD", "#C2E9FB"]);
  const authorGradient = gradient(["#00F260", "#0575E6"]);

  quotes.forEach((quoteObj) => {
    const quoteText = quoteGradient(`"${quoteObj.quote}"`);
    const authorText = chalk.italic(authorGradient(`- ${quoteObj.author}`));
    const fullQuote = `${quoteText}\n\n${authorText}`;
    console.log(boxen(fullQuote, CONFIG.BOXEN_OPTIONS));
  });
};

// -----------------------------------------------------------------------------
// Quote Retrieval Functions
// -----------------------------------------------------------------------------

/**
 * Retrieves and displays a random quote.
 */
const getRandomQuote = async () => {
  const spinner = ora("Fetching a random quote...").start();
  try {
    const randomPage = getRandomPage();
    const url = buildUrl(CONFIG.PATHS.QUOTES, { page: randomPage });
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      spinner.succeed("Quotes fetched!");
      const selectedQuote = quotes[getRandomIndex(quotes.length)];
      displayQuote(selectedQuote);
    } else {
      spinner.info("No quotes found.");
    }
  } catch (error) {
    spinner.fail("Failed to fetch a random quote.");
    console.error(chalk.red("Error:"), error.message);
  }
};

/**
 * Retrieves and displays a random quote for a given tag.
 *
 * @param {string} tag - The tag.
 */
const getRandomQuoteByTag = async (tag) => {
  const correctedTag = correctInput(tag);
  if (correctedTag !== tag) {
    console.log(chalk.green(`Auto-corrected tag: "${correctedTag}"`));
  }
  const spinner = ora(
    `Fetching a random quote for tag "${correctedTag}"...`,
  ).start();
  try {
    const randomPage = getRandomPage();
    const url = buildUrl(
      `${CONFIG.PATHS.TAG}/${encodeURIComponent(correctedTag)}`,
      { page: randomPage },
    );
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      spinner.succeed("Quotes fetched!");
      const selectedQuote = quotes[getRandomIndex(quotes.length)];
      displayQuote(selectedQuote);
    } else {
      spinner.info(`No quotes found for tag: ${correctedTag}`);
    }
  } catch (error) {
    spinner.fail(`Failed to fetch a quote for tag: ${correctedTag}`);
    console.error(chalk.red("Error:"), error.message);
  }
};

/**
 * Retrieves and displays a random quote based on a search query.
 *
 * @param {string} query - The search query.
 */
const getRandomQuoteBySearch = async (query) => {
  const spinner = ora(
    `Fetching a random quote for search "${query}"...`,
  ).start();
  try {
    const randomPage = getRandomPage();
    const params = {
      commit: "Search",
      page: randomPage,
      q: query,
      "search[filters]": "quote",
      utf8: "✓",
    };
    const url = buildUrl(CONFIG.PATHS.SEARCH, params);
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      spinner.succeed("Quotes fetched!");
      const selectedQuote = quotes[getRandomIndex(quotes.length)];
      displayQuote(selectedQuote);
    } else {
      spinner.info(`No quotes found for search: ${query}`);
    }
  } catch (error) {
    spinner.fail(`Failed to fetch a quote for search: ${query}`);
    console.error(chalk.red("Error:"), error.message);
  }
};

/**
 * Retrieves and displays multiple quotes.
 *
 * @param {number} count - Number of quotes to display.
 */
const getBulkQuotes = async (count) => {
  const spinner = ora("Fetching multiple quotes...").start();
  try {
    const randomPage = getRandomPage();
    const url = buildUrl(CONFIG.PATHS.QUOTES, { page: randomPage });
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      spinner.succeed("Quotes fetched!");
      displayQuotes(quotes.slice(0, count));
    } else {
      spinner.info("No quotes found.");
    }
  } catch (error) {
    spinner.fail("Failed to fetch multiple quotes.");
    console.error(chalk.red("Error:"), error.message);
  }
};

/**
 * Retrieves and displays multiple quotes for a given tag.
 *
 * @param {string} tag - The tag.
 * @param {number} count - Number of quotes.
 */
const getBulkQuotesByTag = async (tag, count) => {
  const correctedTag = correctInput(tag);
  if (correctedTag !== tag) {
    console.log(chalk.green(`Auto-corrected tag: "${correctedTag}"`));
  }
  const spinner = ora(
    `Fetching multiple quotes for tag "${correctedTag}"...`,
  ).start();
  try {
    const randomPage = getRandomPage();
    const url = buildUrl(
      `${CONFIG.PATHS.TAG}/${encodeURIComponent(correctedTag)}`,
      { page: randomPage },
    );
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      spinner.succeed("Quotes fetched!");
      displayQuotes(quotes.slice(0, count));
    } else {
      spinner.info(`No quotes found for tag: ${correctedTag}`);
    }
  } catch (error) {
    spinner.fail(`Failed to fetch quotes for tag: ${correctedTag}`);
    console.error(chalk.red("Error:"), error.message);
  }
};

/**
 * Retrieves and displays multiple quotes based on a search query.
 *
 * @param {string} query - The search query.
 * @param {number} count - Number of quotes.
 */
const getBulkQuotesBySearch = async (query, count) => {
  const spinner = ora(
    `Fetching multiple quotes for search "${query}"...`,
  ).start();
  try {
    const randomPage = getRandomPage();
    const params = {
      commit: "Search",
      page: randomPage,
      q: query,
      "search[filters]": "quote",
      utf8: "✓",
    };
    const url = buildUrl(CONFIG.PATHS.SEARCH, params);
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      spinner.succeed("Quotes fetched!");
      displayQuotes(quotes.slice(0, count));
    } else {
      spinner.info(`No quotes found for search: ${query}`);
    }
  } catch (error) {
    spinner.fail(`Failed to fetch quotes for search: ${query}`);
    console.error(chalk.red("Error:"), error.message);
  }
};

// -----------------------------------------------------------------------------
// Exported Request Handlers for CLI Commands
// -----------------------------------------------------------------------------

/**
 * Handles fetching a single quote.
 *
 * @param {string|null} subCommand - "tag", "search", or null.
 * @param {string|null} parameter - The tag or search term.
 */
export const requestQuotes = async (subCommand, parameter) => {
  if (subCommand === "tag" && parameter) {
    await getRandomQuoteByTag(parameter);
  } else if (subCommand === "search" && parameter) {
    await getRandomQuoteBySearch(parameter);
  } else {
    await getRandomQuote();
  }
};

/**
 * Handles fetching multiple quotes.
 *
 * @param {number} count - Number of quotes.
 */
export const requestBulkQuotes = async (count) => {
  await getBulkQuotes(count);
};

/**
 * Handles fetching multiple quotes by tag.
 *
 * @param {string} tag - The tag.
 * @param {number} count - Number of quotes.
 */
export const requestBulkQuotesByTag = async (tag, count) => {
  await getBulkQuotesByTag(tag, count);
};

/**
 * Handles fetching multiple quotes by search.
 *
 * @param {string} query - The search query.
 * @param {number} count - Number of quotes.
 */
export const requestBulkQuotesBySearch = async (query, count) => {
  await getBulkQuotesBySearch(query, count);
};
