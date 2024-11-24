import axios from 'axios';
import chalk from 'chalk';
import clear from 'clear';
import randomNumber from 'random-number';
import * as cheerio from 'cheerio';
import { URLSearchParams } from 'url';

const pageOptions = {
  min: 1,
  max: 100,
  integer: true,
};

/**
 * Extracts quotes from the given Cheerio object.
 *
 * @param {CheerioStatic} $ - Cheerio object containing the HTML.
 * @returns {Array} - Array of quote objects.
 */
const extractQuotes = ($) => {
  const quotes = [];

  $('.quoteText').each((_, element) => {
    const quoteText = $(element).text().trim();

    // Use regex to extract quote and author
    const quoteMatch = quoteText.match(/“(.+?)”\s*―\s*(.+)/s);

    if (quoteMatch) {
      const quote = quoteMatch[1].replace(/\s+/g, ' ').trim();
      const author = quoteMatch[2].split(',')[0].trim();
      quotes.push({ quote, author });
    }
  });

  return quotes;
};

/**
 * Fetches quotes from the given URL.
 *
 * @param {string} url - URL to fetch quotes from.
 * @returns {Promise<Array>} - Promise resolving to an array of quotes.
 */
const fetchQuotes = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    return extractQuotes($);
  } catch (error) {
    console.error(chalk.red('Error fetching quotes:'), error.message);
    throw error;
  }
};

/**
 * Displays a quote in the console.
 *
 * @param {Object} quote - Quote object containing quote and author.
 */
const displayQuote = (quote) => {
  clear();
  console.log('');
  console.log(
      '           ',
      chalk.cyan.bold(`“${quote.quote}”`),
      ' - ',
      chalk.green.italic(quote.author)
  );
  console.log(' ');
};

/**
 * Displays multiple quotes in the console.
 *
 * @param {Array} quotes - Array of quote objects.
 */
const displayQuotes = (quotes) => {
  clear();
  quotes.forEach((quote) => {
    console.log('');
    console.log(
        '           ',
        chalk.cyan.bold(`“${quote.quote}”`),
        ' - ',
        chalk.green.italic(quote.author)
    );
    console.log(' ');
  });
};

/**
 * Retrieves and displays a random quote.
 */
const getRandomQuote = async () => {
  try {
    const randomPage = randomNumber(pageOptions);
    const url = `https://www.goodreads.com/quotes?page=${randomPage}`;
    const quotes = await fetchQuotes(url);

    if (quotes.length > 0) {
      const randomIndex = randomNumber({
        min: 0,
        max: quotes.length - 1,
        integer: true,
      });
      const selectedQuote = quotes[randomIndex];
      displayQuote(selectedQuote);
    } else {
      console.log(chalk.yellow('No quotes found.'));
    }
  } catch (error) {
    console.error(chalk.red('Failed to get a random quote.'), error.message);
  }
};

/**
 * Retrieves and displays a random quote by tag.
 *
 * @param {string} tag - Tag to search for.
 */
const getRandomQuoteByTag = async (tag) => {
  try {
    const randomPage = randomNumber(pageOptions);
    const params = new URLSearchParams({ page: randomPage });
    const url = `https://www.goodreads.com/quotes/tag/${encodeURIComponent(
        tag
    )}?${params.toString()}`;
    const quotes = await fetchQuotes(url);

    if (quotes.length > 0) {
      const randomIndex = randomNumber({
        min: 0,
        max: quotes.length - 1,
        integer: true,
      });
      const selectedQuote = quotes[randomIndex];
      displayQuote(selectedQuote);
    } else {
      console.log(chalk.yellow(`No quotes found for tag: ${tag}`));
    }
  } catch (error) {
    console.error(
        chalk.red(`Failed to get a quote for tag: ${tag}`),
        error.message
    );
  }
};

/**
 * Retrieves and displays a random quote by search query.
 *
 * @param {string} query - Search query.
 */
const getRandomQuoteBySearch = async (query) => {
  try {
    const randomPage = randomNumber(pageOptions);
    const params = new URLSearchParams({
      commit: 'Search',
      page: randomPage,
      q: query,
      'search[filters]': 'quote',
      utf8: '✓',
    });
    const url = `https://www.goodreads.com/quotes/search?${params.toString()}`;
    const quotes = await fetchQuotes(url);

    if (quotes.length > 0) {
      const randomIndex = randomNumber({
        min: 0,
        max: quotes.length - 1,
        integer: true,
      });
      const selectedQuote = quotes[randomIndex];
      displayQuote(selectedQuote);
    } else {
      console.log(chalk.yellow(`No quotes found for search: ${query}`));
    }
  } catch (error) {
    console.error(
        chalk.red(`Failed to get a quote for search: ${query}`),
        error.message
    );
  }
};

/**
 * Retrieves and displays a specified number of quotes.
 *
 * @param {number} n - Number of quotes to retrieve.
 */
const getBulkQuotes = async (n) => {
  try {
    const randomPage = randomNumber(pageOptions);
    const url = `https://www.goodreads.com/quotes?page=${randomPage}`;
    const quotes = await fetchQuotes(url);

    if (quotes.length > 0) {
      const selectedQuotes = quotes.slice(0, n);
      displayQuotes(selectedQuotes);
    } else {
      console.log(chalk.yellow('No quotes found.'));
    }
  } catch (error) {
    console.error(chalk.red('Failed to get bulk quotes.'), error.message);
  }
};

/**
 * Handles the request for quotes based on the command.
 *
 * @param {string|null} subCommand - Sub-command.
 * @param {string|null} parameter - Parameter for the sub-command.
 */
export const requestQuotes = async (subCommand, parameter) => {
  if (subCommand === 'tag' && parameter) {
    await getRandomQuoteByTag(parameter);
  } else if (subCommand === 'search' && parameter) {
    await getRandomQuoteBySearch(parameter);
  } else {
    await getRandomQuote();
  }
};

/**
 * Handles the request for bulk quotes.
 *
 * @param {number} count - Number of quotes to retrieve.
 */
export const requestBulkQuotes = async (count) => {
  await getBulkQuotes(count);
};
