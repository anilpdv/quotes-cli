# quotes-cli

[![Version](https://img.shields.io/npm/v/quotes-cli.svg)](https://www.npmjs.com/package/quotes-cli)
[![License](https://img.shields.io/npm/l/quotes-cli.svg)](https://github.com/yourusername/quotes-cli/blob/master/LICENSE)

`quotes-cli` is a Node.js command-line tool that generates random quotes directly from Goodreads. Fetch random quotes, quotes by tag, search for quotes by author or book, or retrieve multiple quotes at once.

## Features

- **Random Quotes**: Get a random quote.
- **Quotes by Tag**: Fetch a random quote from a specific tag.
- **Search Quotes**: Find quotes by author or book.
- **Bulk Quotes**: Retrieve multiple quotes at once.

## Installation

To install `quotes-cli`, you need [Node.js](https://nodejs.org/) installed on your system. Then, install the package globally using npm:

```sh
npm install -g quotes-cli
```

## Usage

After installation, you can use the `quotes-cli` command in your terminal.

### Commands

- **quote | q**

  Get a random quote.

  ```sh
  quotes-cli quote
  # or
  quotes-cli q
  ```

- **tag | t <name>**

  Get a random quote from a specified tag.

  ```sh
  quotes-cli tag love
  # or
  quotes-cli t love
  ```

- **search | s <query>**

  Get a random quote by searching for an author or book.

  ```sh
  quotes-cli search "Albert Einstein"
  # or
  quotes-cli s "Albert Einstein"
  ```

- **bulk | b <number>**

  Get multiple quotes at once (maximum of 10).

  ```sh
  quotes-cli bulk 5
  # or
  quotes-cli b 5
  ```

### Examples

#### Get a Random Quote

```sh
$ quotes-cli quote
```

**Example Output:**

```
           “Be yourself; everyone else is already taken.”   -  Oscar Wilde
```

#### Get a Random Quote by Tag

```sh
$ quotes-cli tag inspiration
```

**Example Output:**

```
           “The only way to do great work is to love what you do.”   -  Steve Jobs
```

#### Search for a Quote by Author or Book

```sh
$ quotes-cli search "Mark Twain"
```

**Example Output:**

```
           “The secret of getting ahead is getting started.”   -  Mark Twain
```

#### Get Multiple Quotes at Once

```sh
$ quotes-cli bulk 3
```

**Example Output:**

```
           “In three words I can sum up everything I've learned about life: it goes on.”   -  Robert Frost

           “If you tell the truth, you don't have to remember anything.”   -  Mark Twain

           “A friend is someone who knows all about you and still loves you.”   -  Elbert Hubbard
```

### Command Help

You can display help information using:

```sh
quotes-cli --help
```

**Output:**

```
Usage: quotes-cli [options] [command]

quotes-cli

Options:
  -V, --version        output the version number
  -h, --help           output usage information

Commands:
  quote|q              Get a random quote
  tag|t <name>         Get a random quote from a tag
  search|s <query>     Get a random quote from an author or book
  bulk|b <number>      Get a list of quotes (max 10)
```

## Available Tags

Some example tags you can use with the `tag` command:

- love
- life
- inspiration
- humor
- philosophy
- truth
- wisdom
- poetry
- romance
- religion
- success
- knowledge
- motivation
- friendship
- happiness

## Notes

- **Bulk Command Limit**: The `bulk` command fetches up to 10 quotes at a time.
- **Search Query**: When using the `search` command, you can input any keyword, author name, or book title.
- **Randomness**: Quotes are fetched from random pages on Goodreads, providing a wide variety.
- **Internet Connection**: An active internet connection is required as quotes are scraped in real-time from Goodreads.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request on [GitHub](https://github.com/yourusername/quotes-cli).

## Disclaimer

This tool scrapes data from Goodreads for personal use. Please ensure you comply with Goodreads' [Terms of Service](https://www.goodreads.com/terms) when using this tool.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Enjoy your quotes!