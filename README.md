# quotes-cli


[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

quotes-cli is random quote generator for terminal for fun.

```sh
$ quotes-cli -h
Usage: quotes-cli [options] [command]

quotes-cli

Options:
  -V, --version    output the version number
  -h, --help       output usage information

Commands:
  quote|q          Get random quote
  tag|t <name>     Get random quoute from a tag
  search|s <name>  Get random quote from author or book
  bulk|b <nu>      Get list of quotes max[10] specify the number.

```

# Commads
 > quotes-cli has four commands for specific quotes.
 - quote | q
 - tag | t <name>
 - search | s <name>
 - bulk | b <nu>
 
 ## quote | q
```sh
$ quotes-cli q
```
> command 'q' gives random quote.

![Image of Yaktocat](https://raw.githubusercontent.com/anilpdv/quotes-cli/master/images/quotes-cli.png)

## tag | t <name>
```sh
$ quotes-cli t wisdom
```
> tag | t also gives the random quote from selected tag.

![Image of Yaktocat](https://raw.githubusercontent.com/anilpdv/quotes-cli/master/images/quotes-cli-tag.png)
##### example tags like .
- philosophy
- love
- god
- hope
- science
- death

## search | s <name>
```sh
$ quotes-cli s walden
```
> search command takes name as argument you can search any book or author.

![Image of Yaktocat](https://raw.githubusercontent.com/anilpdv/quotes-cli/master/images/quotes-cli-search.png)

#### example searches like:
- into+the+wild
- leo+tolstoy
- idiot

## bulk | b <nu>

```sh
$ quotes-cli b 4
```
> bulk takes a number as argument gives quotes upto that number max would be 10. There is no pages in the bulk command the quotes would be not vary may this command may add sub command page to get more quotes.

![Image of Yaktocat](https://raw.githubusercontent.com/anilpdv/quotes-cli/master/images/quotes-cli-bulk.png)
