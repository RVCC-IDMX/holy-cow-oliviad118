#!/usr/bin/env node
import { Command } from 'commander';
import getStdin from 'get-stdin';
import stripFinalNewline from 'strip-final-newline';
import * as cowsay from './index.js';

const program = new Command();

// Determine if invoked as cowthink
const isThinkMode = process.argv[1] && /cowthink/.test(process.argv[1]);

program
  .name(isThinkMode ? 'cowthink' : 'holy-cow')
  .description('Holy Cow - A modernized configurable talking/thinking cow')
  .version('2.0.0')
  .argument('[message...]', 'Message for the cow to say or think')
  .usage('[options] [message...]')
  .addHelpText('after', `
Examples:
  $ holy-cow "Hello World"
  $ holy-cow -f dragon "Roar!"
  $ cowthink -d "I'm dead"
  $ echo "Moo" | holy-cow

If invoked as cowthink, the cow will think its message instead of saying it.
If any command-line arguments are left over after all switches have been processed,
they become the cow's message.`);

// Face/Mode options
program
  .option('-b, --borg', 'Borg mode (eyes: ==)')
  .option('-d, --dead', 'Dead mode (eyes: xx, tongue: U )')
  .option('-g, --greedy', 'Greedy mode (eyes: $$)')
  .option('-p, --paranoia', 'Paranoid mode (eyes: @@)')
  .option('-s, --stoned', 'Stoned mode (eyes: **, tongue: U )')
  .option('-t, --tired', 'Tired mode (eyes: --)')
  .option('-w, --wired', 'Wired mode (eyes: OO)')
  .option('-y, --youthful', 'Youthful mode (eyes: ..)');

// Customization options
program
  .option('-e, --eyes <string>', "Set the cow's eyes", 'oo')
  .option('-T, --tongue <string>', "Set the cow's tongue", '  ')
  .option('-f, --file <cowfile>', 'Specify cow file (name or path)', 'default')
  .option('-W, --wrap <columns>', 'Set word wrap width', '40');

// Behavior options
program
  .option('-n, --nowrap', 'Disable word wrapping')
  .option('-r, --random', 'Choose a random cow')
  .option('-l, --list', 'List all available cow files')
  .option('--think', 'Think the message instead of saying it');

program.parse(process.argv);

const options = program.opts();
const args = program.args;

// Handle list command
if (options.list) {
  cowsay.list((err, list) => {
    if (err) throw new Error(err);
    console.log(list.join('  '));
  });
} else if (args.length > 0) {
  // Message provided as arguments
  say(args.join(' '));
} else {
  // Try to read from stdin
  getStdin().then((data) => {
    if (data) {
      say(stripFinalNewline(data));
    } else {
      program.help();
    }
  });
}

function say(text) {
  // Build options object compatible with cowsay API
  const cowOptions = {
    text: text,
    e: options.eyes,
    T: options.tongue,
    f: options.file,
    W: parseInt(options.wrap),
    n: options.nowrap,
    r: options.random,
    b: options.borg,
    d: options.dead,
    g: options.greedy,
    p: options.paranoia,
    s: options.stoned,
    t: options.tired,
    w: options.wired,
    y: options.youthful,
    think: options.think,
    _: [text]
  };

  const think = isThinkMode || options.think;
  console.log(think ? cowsay.think(cowOptions) : cowsay.say(cowOptions));
}
