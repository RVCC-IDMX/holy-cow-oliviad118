# 🐮 Holy Cow

````
 ___________________________________________
/ Holy Cow! A modernized cowsay with ES    \
| Modules, modern CLI tooling, and custom  |
\ cow builder!                             /
 -------------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
````

**Holy Cow** is a modern rewrite of the classic [cowsay](https://github.com/piuccio/cowsay) program with three major improvements:

1. ⚡ **ES Modules** - Modern JavaScript with `import`/`export` syntax
2. 🛠️ **Modern CLI** - Powered by [Commander.js](https://github.com/tj/commander.js) instead of outdated yargs
3. 🎨 **Custom Cow Builder** - Interactive tool to create and share your own ASCII art cows

Based on the original Perl cowsay by [Tony Monroe](https://github.com/tnalpgge/rank-amateur-cowsay) and the JavaScript port by [Fabio Crisci](https://github.com/piuccio/cowsay).

## ✨ What's New in Holy Cow

### 🔄 ES Modules Support
- Uses modern `import`/`export` syntax throughout
- Works seamlessly with modern JavaScript tooling
- Better tree-shaking and bundle optimization
- Compatible with both Node.js and browsers

### ⚡ Modern CLI with Commander.js
- Cleaner, more maintainable command parsing
- Better help text and error messages
- Smaller bundle size compared to old yargs
- Built-in version command (`-V, --version`)

### 🎨 Custom Cow Builder
Create your own custom ASCII art cows interactively!

```bash
holy-cow --create
```

This launches an interactive prompt where you can:
- Name your cow
- Add a description
- Create ASCII art in your editor  
- Add tags for organization
- Save to `~/.holy-cow/custom-cows/`

Use your custom cow immediately:
```bash
holy-cow -f my-custom-cow "Hello World!"
```

List all your custom cows:
```bash
holy-cow --list-custom
```

## 📦 Install

    npm install -g holy-cow

> **Note:** Once installed, you can use `holy-cow`, `cowsay`, or `cowthink` commands

## 🚀 Quick Start

Basic usage:

    holy-cow "JavaScript FTW!"

or for thinking mode:

    cowthink "node.js is cool"

With different cow:

    holy-cow -f dragon "Rawr!"

Dead mode:

    holy-cow -d "I'm dead"

Random cow:

    holy-cow -r "Surprise me!"

## 📖 Usage

### Command Line Options

```
Usage: holy-cow [options] [message...]

Arguments:
  message                Message for the cow to say or think

Options:
  -V, --version          output the version number
  -b, --borg             Borg mode (eyes: ==)
  -d, --dead             Dead mode (eyes: xx, tongue: U )
  -g, --greedy           Greedy mode (eyes: $$)
  -p, --paranoia         Paranoid mode (eyes: @@)
  -s, --stoned           Stoned mode (eyes: **, tongue: U )
  -t, --tired            Tired mode (eyes: --)
  -w, --wired            Wired mode (eyes: OO)
  -y, --youthful         Youthful mode (eyes: ..)
  -e, --eyes <string>    Set the cow's eyes (default: "oo")
  -T, --tongue <string>  Set the cow's tongue (default: "  ")
  -f, --file <cowfile>   Specify cow file (name or path) (default: "default")
  -W, --wrap <columns>   Set word wrap width (default: "40")
  -n, --nowrap           Disable word wrapping
  -r, --random           Choose a random cow
  -l, --list             List all available cow files
  --list-custom          List all custom cows you've created
  --create               Create a new custom cow interactively
  --think                Think the message instead of saying it
  -h, --help             display help for command
```

### Examples

```bash
# Basic cow
holy-cow "Hello World"

# Different cow file
holy-cow -f dragon "Rawr!"

# Custom eyes and tongue
holy-cow -e "^^" -T "  " "Happy cow"

# Dead cow mode
holy-cow -d "I am dead"

# Random cow
holy-cow -r "Surprise me!"

# Thinking cow
cowthink "Hmm..."

# Pipe input
echo "Mooooo" | holy-cow

# List all available cows
holy-cow -l

# Create a custom cow
holy-cow --create

# Use your custom cow
holy-cow -f my-awesome-cow "I'm custom!"

# List your custom cows
holy-cow --list-custom
```

## 📚 Usage as a Module

Holy Cow can be used as an ES module in your projects:

```js
import * as cowsay from "holy-cow";

console.log(cowsay.say({
    text : "I'm a moooodule",
    e : "oO",
    T : "U "
}));

// or cowsay.think()
```

Output:
````
 _________________
( I'm a moooodule )
 -----------------
        \   ^__^
         \  (oO)\_______
            (__)\       )\/\
             U  ||----w |
                ||     ||
````

### Getting a List of Cow Names

```js
import * as cowsay from "holy-cow";

function get_cows(error, cow_names) {
    if (error) {
        console.log(error)
    }
    else if (cow_names) {
        console.log(`Number of cows available: ${cow_names.length}`);
    }
}

cowsay.list(get_cows);
```

### TypeScript Examples

```ts
import * as cowsay from "holy-cow"

let output: string = cowsay.say({ text: 'Hello from typescript!' });

console.log(output);
```

Getting a list of cow names:
```ts
function get_cows(error: NodeJS.ErrnoException, cow_names: Array<string>): void {
    if (error) {
        console.log(`Error getting cow names: ${error.message}`)
    }
    else if (cow_names) {
        console.log(`Number of cows available: ${cow_names.length}`);
    }
}

cowsay.list(get_cows);
```

Importing the `IOptions` interface directly:
```ts
import { IOptions } from "holy-cow" // optional

let opts: IOptions = {
    text: "Hello from TypeScript!",
    e: '^^',
    r: true,
};

console.log(cowsay.say(opts));
```

## 🌐 Usage in the Browser

Holy Cow works in your browser too with rollup / webpack / browserify / you name it.

```js
import { say } from 'holy-cow';

console.log(say({ text: 'grazing in the browser' }));
```

You can customize the cow by importing the relevant one

```js
import { think, SQUIRREL } from 'holy-cow';

console.log(think({
  text: 'grazing in the browser',
  cow: SQUIRREL,
  eyes: 'pp',
  tongue: ';;',
}));
```

All cows are included in the bundle, but you can use rollup / webpack tree-shake feature to reduce the final bundle size.

### Browser Options

```js
say({
  text: 'hello',
  cow: '', // Template for a cow, get inspiration from `./cows`
  eyes: 'oo', // Select the appearance of the cow's eyes, equivalent to -e
  tongue: 'L|', // The tongue is configurable similarly to the eyes, equivalent to -T
  wrap: false, // If it is specified, the given message will not be word-wrapped. equivalent to -n
  wrapLength: 40, // Specifies roughly where the message should be wrapped. equivalent to -W
  mode: 'b', // One of "b", "d", "g", "p", "s", "t", "w", "y"
});
```

## 🎨 Creating Custom Cows

Holy Cow makes it easy to create and use custom ASCII art cows!

### Interactive Builder

Run the interactive builder:

```bash
holy-cow --create
```

You'll be prompted for:
- **Cow name**: A unique identifier (alphanumeric, hyphens, underscores)
- **Description**: Optional description of your cow
- **ASCII art**: Your editor will open for you to create the art
- **Tags**: Optional tags for organization

### Custom Cow Variables

Use these special variables in your ASCII art:
- `$thoughts` - The connector to the speech bubble (\ for say, o for think)
- `$eyes` or `${eyes}` - The cow's eyes (default: "oo")
- `$tongue` or `${tongue}` - The cow's tongue (default: "  ")

### Example Custom Cow

```
$thoughts
 $thoughts
  $thoughts   /\\_//\\
    ^____^
    ($eyes)\\_______
    (__)\\       )\\/\\
     $tongue ||----w |
        ||     ||
```

Custom cows are saved to `~/.holy-cow/custom-cows/` and can be used immediately with the `-f` flag.

## 📊 What Changed from Original Cowsay?

### Modern JavaScript (ES Modules)
- ✅ All `require()` → `import`
- ✅ All `module.exports` → `export`
- ✅ Added `"type": "module"` to package.json
- ✅ All imports use `.js` extensions
- ✅ Proper `__dirname` polyfill for ESM

### Modern CLI (Commander vs Yargs)
- ✅ Replaced yargs 15.4.1 (from 2020) with latest Commander.js
- ✅ Cleaner command-line argument parsing
- ✅ Better help formatting and error messages
- ✅ Smaller bundle size (fewer dependencies)
- ✅ Version command with `-V` flag
- ✅ 100% backward compatible with original flags

### New Features
- ✅ `--create` flag for interactive custom cow creation
- ✅ `--list-custom` flag to view your custom cows
- ✅ Custom cows stored in `~/.holy-cow/custom-cows/`
- ✅ Metadata storage (JSON) for descriptions and tags
- ✅ Automatic custom cow detection
- ✅ Cow name validation
- ✅ ASCII art validation

## 📜 License

MIT

## 🙏 Credits

- **Original Perl cowsay**: [Tony Monroe](https://github.com/tnalpgge/rank-amateur-cowsay)
- **JavaScript cowsay**: [Fabio Crisci](https://github.com/piuccio/cowsay)
- **Holy Cow modernization**: Created as a learning project for RVCC IDMX 244

## 🤝 Contributing

Contributions are welcome! This project demonstrates:
- ES Module conversion
- Modern CLI tooling
- Interactive terminal applications
- File I/O and user configuration directories
- Input validation and error handling

---

````
 ___________________________________
/ Thanks for using Holy Cow! Now   \
\ go create some awesome cows! 🐮  /
 -----------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
````
