const axios = require('axios');
const chalk = require('chalk');
const figlet = require('figlet');
const clear = require('clear');
const rn = require('random-number');
const Promise = require('bluebird');
const {
  BASEURL,
  URL_page,
  SUBURL_tag,
  SUBURL_search,
  SUBURL_quotes,
} = require('./constants.urls');

// : fetchdata
let options = {
  min: 0,
  max: 99,
  integer: true,
};

let options2 = {
  min: 0,
  max: 29,
  integer: true,
};

let option3 = {
  min: 0,
  max: 19,
  integer: true,
};

let randomPage_tag = rn(options);
let randomPage_search = rn(options2);
let randomPage_quotes = rn(options);
let randomQuote = rn(options2);
let randomQuote_search = rn(option3);

// : pretty print formatter
let prettyPrint = error => {
  console.log('');

  console.log(
    '                                        ',
    chalk.red(
      'opps! search for wrong name ,or page would be not existed sorry.',
    ),
  );
  console.log(' ');
};

return_quote = {};
const request = (url, sub_url) => {
  axios
    .get(url, {})
    .then(resp => {
      if (sub_url === 'search') {
        var quote = resp.data.quotes[randomQuote_search].quote;
        var author = resp.data.quotes[randomQuote_search].author;
      } else {
        var quote = resp.data.quotes[randomQuote].quote;
        var author = resp.data.quotes[randomQuote].author;
      }
      clear();
      console.log('');
      console.log(
        '           ',

        chalk.cyan.bold(quote) + '  ',
        ' - ',
        chalk.green.italic(author),
      );
      console.log(' ');
    })
    .catch(err => {
      clear();
      console.log('');

      console.log(
        '                                        ',
        chalk.red(
          'opps! search for wrong name ,or page would be not existed sorry.',
        ),
      );
      console.log(' ');
    });
};

const request_quotes = (suburl, para) => {
  let url = '';
  if (suburl === 'tag' && para) {
    url = BASEURL + SUBURL_tag + para + URL_page + randomPage_tag;
    request(url, 'tag');
  } else if (suburl === 'search' && para) {
    url = BASEURL + SUBURL_search + para + URL_page + randomPage_search;
    request(url, 'search');
  } else {
    url = BASEURL + SUBURL_quotes + URL_page + randomPage_quotes;
    request(url, 'quotes');
  }
};

const bulk_loader = (url, nu) => {
  if (nu > 30 || nu < 0) {
    clear();
    console.log(chalk.red('out of bond search max and min are 0-30'));
  } else {
    axios
      .get(url)
      .then(resp => {
        clear();
        for (let i = 0; i < nu; i++) {
          console.log('');
          console.log(
            '        ',
            chalk.cyan.bold(resp.data.quotes[i].quote),
            ' - ',
            chalk.green.italic(resp.data.quotes[i].author),
          );
          console.log(' ');
        }
      })
      .catch(err => {
        console.log(chalk.red(' sorry , may be pages are missing '));
      });
  }
};

const request_quotes_bulk = nu => {
  let url = BASEURL + SUBURL_quotes;
  bulk_loader(url, nu);
};
module.exports = {request_quotes, request_quotes_bulk};
