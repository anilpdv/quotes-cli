<div align="center">

# 📚 quotes-cli

![Quotes CLI Logo](https://img.shields.io/badge/📖-Quotes%20CLI-blue?style=for-the-badge)

[![Version](https://img.shields.io/npm/v/quotes-cli.svg?style=flat-square)](https://www.npmjs.com/package/quotes-cli)
[![License](https://img.shields.io/npm/l/quotes-cli.svg?style=flat-square)](https://github.com/yourusername/quotes-cli/blob/master/LICENSE)
[![Downloads](https://img.shields.io/npm/dt/quotes-cli.svg?style=flat-square)](https://www.npmjs.com/package/quotes-cli)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/quotes-cli?style=flat-square)](https://github.com/yourusername/quotes-cli/stargazers)
[![Made with Node.js](https://img.shields.io/badge/Node.js->=14-green?style=flat-square&logo=node.js)](https://nodejs.org)

_Your daily dose of wisdom and inspiration, right from the terminal_ 🌟

[Installation](#-installation) • [Features](#-features) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributing](#-contributing)

---

</div>

## ✨ Features

<div align="center">

| Feature              | Description                           |
| -------------------- | ------------------------------------- |
| 🎲 **Random Quotes** | Get instant wisdom with random quotes |
| 🏷️ **Tagged Quotes** | Find quotes by specific categories    |
| 🔍 **Smart Search**  | Search by author or book titles       |
| 📚 **Bulk Fetch**    | Get multiple quotes at once           |
| 🎯 **Filtered Bulk** | Get multiple quotes by tag or search  |

</div>

## 🚀 Installation

<details>
<summary>Prerequisites</summary>

- Node.js installed on your system
- npm or yarn package manager
- Active internet connection
</details>

```bash
# Using npm
npm install -g quotes-cli
```

## 📖 Usage

### 🎯 Available Commands

<table>
<tr>
<th>Command</th>
<th>Description</th>
<th>Example</th>
</tr>
<tr>
<td><code>quote | q</code></td>
<td>Get a random quote</td>
<td><code>quotes-cli q</code></td>
</tr>
<tr>
<td><code>tag | t &lt;name&gt;</code></td>
<td>Get a quote by tag</td>
<td><code>quotes-cli t love</code></td>
</tr>
<tr>
<td><code>search | s &lt;query&gt;</code></td>
<td>Search quotes</td>
<td><code>quotes-cli s "Einstein"</code></td>
</tr>
<tr>
<td><code>bulk | b &lt;number&gt;</code></td>
<td>Get multiple quotes</td>
<td><code>quotes-cli b 5</code></td>
</tr>
<tr>
<td><code>bulk-tag | bt &lt;name&gt; &lt;number&gt;</code></td>
<td>Get multiple quotes by tag</td>
<td><code>quotes-cli bt inspiration 4</code></td>
</tr>
<tr>
<td><code>bulk-search | bs &lt;query&gt; &lt;number&gt;</code></td>
<td>Get multiple quotes by search</td>
<td><code>quotes-cli bs "Mark Twain" 3</code></td>
</tr>
</table>

### 💫 Command Examples

#### Get a Random Quote

```bash
$ quotes-cli quote
```

<div align="center">

```
┌─────────────────────────────────────────────────────┐
│  "Be yourself; everyone else is already taken."     │
│                               - Oscar Wilde         │
└─────────────────────────────────────────────────────┘
```

</div>

#### Get Multiple Quotes by Tag

```bash
$ quotes-cli bulk-tag humor 3
```

<div align="center">

```
╔════════════════════════════════════════════════════╗
║ "Laughter is timeless, imagination has no age,     ║
║  and dreams are forever."                          ║
║                               - Walt Disney        ║
╚════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════╗
║ "A day without laughter is a day wasted."          ║
║                               - Charlie Chaplin    ║
╚════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════╗
║ "Life is short. Smile while you still have teeth." ║
║                               - Unknown            ║
╚════════════════════════════════════════════════════╝
```

</div>

## 🏷️ Available Tags

<div align="center">

| Category 1     | Category 2   | Category 3    | Category 4    |
| -------------- | ------------ | ------------- | ------------- |
| 💝 love        | 🌟 life      | 💡 wisdom     | 🎭 poetry     |
| ✨ inspiration | 😄 humor     | 🤔 philosophy | 💑 romance    |
| ⛪ religion    | 🎯 success   | 📚 knowledge  | 🤝 friendship |
| 🎨 motivation  | 😊 happiness | 🌈 hope       | ✌️ peace      |

</div>

## 🛠️ Technical Notes

<details>
<summary><b>Command Options</b></summary>

```bash
Usage: quotes-cli [options] [command]

Options:
  -V, --version              output the version number
  -h, --help                 output usage information

Commands:
  quote | q                  Get a random quote
  tag | t <name>             Get a random quote from a tag
  search | s <query>         Get a random quote from an author or book
  bulk | b <number>          Get multiple random quotes (max 10)
  bulk-tag | bt <name> <number>
                            Get multiple quotes from a tag (max 10)
  bulk-search | bs <query> <number>
                            Get multiple quotes from a search query (max 10)
```

</details>

<details>
<summary><b>Limitations</b></summary>

- Maximum 10 quotes per bulk request (applies to bulk, bulk-tag, and bulk-search)
- Requires active internet connection
- Real-time Goodreads scraping
- Random page selection for variety
</details>

## 👥 Contributing

We love contributions! 💝

1. 🍴 Fork the repository
2. 🌿 Create your feature branch
3. 💫 Make your changes
4. 🚀 Submit a pull request

## ⚖️ Legal

<div align="center">

[![Goodreads TOS](https://img.shields.io/badge/Goodreads-Terms%20of%20Service-lightgrey?style=flat-square)](https://www.goodreads.com/terms)

</div>

This tool scrapes data from Goodreads for personal use. Please comply with Goodreads' Terms of Service.

## 📜 License

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

Copyright © 2024 [anilpdv](https://github.com/anilpdv)

</div>

---

<div align="center">

Made with ❤️ by [Anil Palli](https://github.com/anilpdv)

**[⬆ back to top](#-quotes-cli)**

</div>

