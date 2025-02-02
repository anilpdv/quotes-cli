/**
 * routes.data.js
 *
 * This module contains all functions for fetching, extracting, and displaying quotes
 * from Goodreads. It separates the business logic from the CLI command handling,
 * which improves maintainability and makes it easier for contributors to understand the code.
 */

import axios from "axios"; // For making HTTP requests
import chalk from "chalk"; // For terminal string styling
import clear from "clear"; // To clear the terminal
import randomNumber from "random-number"; // To generate random numbers
import * as cheerio from "cheerio"; // For parsing HTML
import { URLSearchParams } from "url"; // To build URL query parameters
import boxen from "boxen"; // To display text in a styled box
import gradient from "gradient-string"; // To apply color gradients to text
import figlet from "figlet"; // To generate ASCII art banners

// -----------------------------------------------------------------------------
// Global Configuration and Helper Constants
// -----------------------------------------------------------------------------

// Configuration for generating a random page number (from 1 to 100)
const pageOptions = {
  min: 1,
  max: 100,
  integer: true,
};

// Constant for styling the box around the quotes
const BOXEN_OPTIONS = {
  padding: 1,
  margin: 1,
  borderColor: "magenta",
  borderStyle: "round",
};

/**
 * Returns a random index for an array of given length.
 *
 * @param {number} length - The length of the array.
 * @returns {number} A random integer between 0 and length - 1.
 */
const getRandomIndex = (length) =>
  randomNumber({ min: 0, max: length - 1, integer: true });

// -----------------------------------------------------------------------------
// Quote Extraction and Fetching Functions
// -----------------------------------------------------------------------------

/**
 * Extracts quotes from a Cheerio-loaded HTML.
 *
 * It looks for elements with the class "quoteText" and extracts:
 * - The quote text from the first text node.
 * - The author from the first child with the class "authorOrTitle".
 *
 * @param {CheerioStatic} $ - The Cheerio instance loaded with HTML content.
 * @returns {Array<{quote: string, author: string}>} Array of quote objects.
 */
const extractQuotes = ($) => {
  const quotes = [];

  $(".quoteText").each((_, element) => {
    const quoteElement = $(element);

    // Extract the raw quote text (first text node)
    const rawQuote = quoteElement
      .contents()
      .filter((_, el) => el.type === "text")
      .first()
      .text()
      .trim();

    // Remove any leading/trailing quotes (both straight and fancy)
    const cleanQuote = rawQuote.replace(/^["“”]+|["“”]+$/g, "").trim();

    // Extract the author from the first element with class "authorOrTitle"
    const author = quoteElement.find(".authorOrTitle").first().text().trim();

    if (cleanQuote && author) {
      quotes.push({ quote: cleanQuote, author });
    }
  });

  return quotes;
};

/**
 * Fetches HTML content from a URL and extracts quotes.
 *
 * @param {string} url - The URL to fetch quotes from.
 * @returns {Promise<Array<{quote: string, author: string}>>} A promise that resolves with an array of quote objects.
 */
const fetchQuotes = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    return extractQuotes($);
  } catch (error) {
    console.error(chalk.red("Error fetching quotes:"), error.message);
    throw error;
  }
};

// -----------------------------------------------------------------------------
// Display Functions (Presentation Logic)
// -----------------------------------------------------------------------------

/**
 * Displays an ASCII art header using figlet and gradient-string.
 *
 * Clears the terminal and prints a colorful banner at the top.
 */
const displayHeader = () => {
  const banner = figlet.textSync("Quotes CLI", { horizontalLayout: "full" });
  console.log(gradient.pastel.multiline(banner));
  console.log("\n");
};

/**
 * Displays a single quote inside a styled box.
 *
 * @param {{quote: string, author: string}} quoteObj - The quote object to display.
 */
const displayQuote = (quoteObj) => {
  clear();
  displayHeader();

  const quoteText = gradient.summer(`"${quoteObj.quote}"`);
  const authorText = chalk.greenBright.italic(`- ${quoteObj.author}`);
  const fullQuote = `${quoteText}\n\n${authorText}`;

  console.log(boxen(fullQuote, BOXEN_OPTIONS));
};

/**
 * Displays multiple quotes, each within its own styled box.
 *
 * @param {Array<{quote: string, author: string}>} quotes - An array of quote objects.
 */
const displayQuotes = (quotes) => {
  clear();
  displayHeader();

  quotes.forEach((quoteObj) => {
    const quoteText = gradient.summer(`"${quoteObj.quote}"`);
    const authorText = chalk.greenBright.italic(`- ${quoteObj.author}`);
    const fullQuote = `${quoteText}\n\n${authorText}`;
    console.log(boxen(fullQuote, BOXEN_OPTIONS));
  });
};

// -----------------------------------------------------------------------------
// Quote Retrieval Functions (Business Logic)
// -----------------------------------------------------------------------------

/**
 * Retrieves and displays a random quote.
 */
const getRandomQuote = async () => {
  try {
    const randomPage = randomNumber(pageOptions);
    const url = `https://www.goodreads.com/quotes?page=${randomPage}`;
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      const selectedQuote = quotes[getRandomIndex(quotes.length)];
      displayQuote(selectedQuote);
    } else {
      console.log(chalk.yellow("No quotes found."));
    }
  } catch (error) {
    console.error(chalk.red("Failed to get a random quote."), error.message);
  }
};

/**
 * Retrieves and displays a random quote for a given tag.
 *
 * @param {string} tag - The tag to filter quotes.
 */
const getRandomQuoteByTag = async (tag) => {
  try {
    const randomPage = randomNumber(pageOptions);
    const params = new URLSearchParams({ page: randomPage });
    const url = `https://www.goodreads.com/quotes/tag/${encodeURIComponent(
      tag,
    )}?${params.toString()}`;
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      const selectedQuote = quotes[getRandomIndex(quotes.length)];
      displayQuote(selectedQuote);
    } else {
      console.log(chalk.yellow(`No quotes found for tag: ${tag}`));
    }
  } catch (error) {
    console.error(
      chalk.red(`Failed to get a quote for tag: ${tag}`),
      error.message,
    );
  }
};

/**
 * Retrieves and displays a random quote based on a search query.
 *
 * @param {string} query - The search query.
 */
const getRandomQuoteBySearch = async (query) => {
  try {
    const randomPage = randomNumber(pageOptions);
    const params = new URLSearchParams({
      commit: "Search",
      page: randomPage,
      q: query,
      "search[filters]": "quote",
      utf8: "✓",
    });
    const url = `https://www.goodreads.com/quotes/search?${params.toString()}`;
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      const selectedQuote = quotes[getRandomIndex(quotes.length)];
      displayQuote(selectedQuote);
    } else {
      console.log(chalk.yellow(`No quotes found for search: ${query}`));
    }
  } catch (error) {
    console.error(
      chalk.red(`Failed to get a quote for search: ${query}`),
      error.message,
    );
  }
};

/**
 * Retrieves and displays multiple quotes.
 *
 * @param {number} count - The number of quotes to display.
 */
const getBulkQuotes = async (count) => {
  try {
    const randomPage = randomNumber(pageOptions);
    const url = `https://www.goodreads.com/quotes?page=${randomPage}`;
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      const selectedQuotes = quotes.slice(0, count);
      displayQuotes(selectedQuotes);
    } else {
      console.log(chalk.yellow("No quotes found."));
    }
  } catch (error) {
    console.error(chalk.red("Failed to get bulk quotes."), error.message);
  }
};

/**
 * Retrieves and displays multiple quotes for a given tag.
 *
 * @param {string} tag - The tag to filter quotes.
 * @param {number} count - The number of quotes to display.
 */
const getBulkQuotesByTag = async (tag, count) => {
  try {
    const randomPage = randomNumber(pageOptions);
    const params = new URLSearchParams({ page: randomPage });
    const url = `https://www.goodreads.com/quotes/tag/${encodeURIComponent(
      tag,
    )}?${params.toString()}`;
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      const selectedQuotes = quotes.slice(0, count);
      displayQuotes(selectedQuotes);
    } else {
      console.log(chalk.yellow(`No quotes found for tag: ${tag}`));
    }
  } catch (error) {
    console.error(
      chalk.red(`Failed to get quotes for tag: ${tag}`),
      error.message,
    );
  }
};

/**
 * Retrieves and displays multiple quotes based on a search query.
 *
 * @param {string} query - The search query.
 * @param {number} count - The number of quotes to display.
 */
const getBulkQuotesBySearch = async (query, count) => {
  try {
    const randomPage = randomNumber(pageOptions);
    const params = new URLSearchParams({
      commit: "Search",
      page: randomPage,
      q: query,
      "search[filters]": "quote",
      utf8: "✓",
    });
    const url = `https://www.goodreads.com/quotes/search?${params.toString()}`;
    const quotes = await fetchQuotes(url);
    if (quotes.length > 0) {
      const selectedQuotes = quotes.slice(0, count);
      displayQuotes(selectedQuotes);
    } else {
      console.log(chalk.yellow(`No quotes found for search: ${query}`));
    }
  } catch (error) {
    console.error(
      chalk.red(`Failed to get quotes for search: ${query}`),
      error.message,
    );
  }
};

// -----------------------------------------------------------------------------
// Exported Request Handlers for CLI Commands
// -----------------------------------------------------------------------------

/**
 * Handles fetching a single random quote, a quote by tag, or by search query.
 *
 * @param {string|null} subCommand - "tag", "search", or null.
 * @param {string|null} parameter - The tag name or search term.
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
 * Handles fetching multiple random quotes.
 *
 * @param {number} count - Number of quotes to retrieve.
 */
export const requestBulkQuotes = async (count) => {
  await getBulkQuotes(count);
};

/**
 * Handles fetching multiple quotes for a specific tag.
 *
 * @param {string} tag - The tag to filter quotes.
 * @param {number} count - Number of quotes to retrieve.
 */
export const requestBulkQuotesByTag = async (tag, count) => {
  await getBulkQuotesByTag(tag, count);
};

/**
 * Handles fetching multiple quotes based on a search query.
 *
 * @param {string} query - The search query.
 * @param {number} count - Number of quotes to retrieve.
 */
export const requestBulkQuotesBySearch = async (query, count) => {
  await getBulkQuotesBySearch(query, count);
};
