import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the directory for custom cows
export function getCustomCowsDir() {
  const homeDir = os.homedir();
  const customDir = path.join(homeDir, '.holy-cow', 'custom-cows');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(customDir)) {
    fs.mkdirSync(customDir, { recursive: true });
  }
  
  return customDir;
}

// Validate cow name
function validateCowName(name) {
  if (!name || name.trim().length === 0) {
    return 'Cow name cannot be empty';
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    return 'Cow name can only contain letters, numbers, hyphens, and underscores';
  }
  return true;
}

// Validate ASCII art
function validateAsciiArt(art) {
  if (!art || art.trim().length === 0) {
    return 'ASCII art cannot be empty';
  }
  if (!art.includes('$thoughts') && !art.includes('\\') && !art.includes('o')) {
    return 'Warning: Your cow should include $thoughts (or \\ or o) to connect to the speech bubble';
  }
  return true;
}

// Create interactive cow builder
export async function createCustomCow() {
  console.log('\n🐮 Welcome to the Holy Cow Custom Cow Builder! 🐮\n');
  console.log('Let\'s create your custom cow ASCII art!\n');
  console.log('Tips:');
  console.log('  - Use $thoughts for the connector to the speech bubble');
  console.log('  - Use $eyes for the cow\'s eyes');
  console.log('  - Use $tongue for the cow\'s tongue');
  console.log('  - Use ${eyes} and ${tongue} as alternative syntax\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of your cow?',
      validate: validateCowName
    },
    {
      type: 'input',
      name: 'description',
      message: 'Describe your cow (optional):',
      default: ''
    },
    {
      type: 'editor',
      name: 'asciiArt',
      message: 'Create your ASCII art (an editor will open):',
      default: `$thoughts
 $thoughts
        ^__^
        ($eyes)\\_______
        (__)\\       )\\/\\
         $tongue ||----w |
            ||     ||`,
      validate: validateAsciiArt
    },
    {
      type: 'input',
      name: 'tags',
      message: 'Add tags (comma-separated, optional):',
      default: '',
      filter: (input) => {
        if (!input) return [];
        return input.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Save this cow?',
      default: true
    }
  ]);

  if (!answers.confirm) {
    console.log('\n❌ Cow creation cancelled.');
    return null;
  }

  // Create cow object
  const cow = {
    name: answers.name,
    description: answers.description,
    art: answers.asciiArt,
    tags: answers.tags,
    created: new Date().toISOString(),
    version: '1.0'
  };

  // Save cow to file
  const customDir = getCustomCowsDir();
  const cowFilePath = path.join(customDir, `${answers.name}.cow`);
  
  // Check if cow already exists
  if (fs.existsSync(cowFilePath)) {
    const overwrite = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `A cow named "${answers.name}" already exists. Overwrite?`,
        default: false
      }
    ]);
    
    if (!overwrite.overwrite) {
      console.log('\n❌ Cow creation cancelled.');
      return null;
    }
  }

  // Write the cow file in cowsay format
  fs.writeFileSync(cowFilePath, answers.asciiArt, 'utf-8');

  // Also save metadata as JSON
  const metadataPath = path.join(customDir, `${answers.name}.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(cow, null, 2), 'utf-8');

  console.log(`\n✅ Success! Your cow "${answers.name}" has been created!`);
  console.log(`\n📁 Saved to: ${cowFilePath}`);
  console.log(`\nTry it out with: holy-cow -f ${answers.name} "Hello!"`);
  console.log(`Or: holy-cow -f ${cowFilePath} "Hello!"`);

  return cow;
}

// List custom cows
export function listCustomCows() {
  const customDir = getCustomCowsDir();
  
  if (!fs.existsSync(customDir)) {
    console.log('\n📂 No custom cows directory found.');
    console.log('Create your first cow with: holy-cow --create\n');
    return [];
  }

  const files = fs.readdirSync(customDir);
  const cowFiles = files.filter(f => f.endsWith('.cow'));
  
  if (cowFiles.length === 0) {
    console.log('\n📂 No custom cows found.');
    console.log('Create your first cow with: holy-cow --create\n');
    return [];
  }

  console.log(`\n🐮 Custom Cows (${cowFiles.length}):\n`);
  
  cowFiles.forEach(file => {
    const name = path.basename(file, '.cow');
    const metadataPath = path.join(customDir, `${name}.json`);
    
    let metadata = { name, description: '' };
    if (fs.existsSync(metadataPath)) {
      try {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    console.log(`  • ${metadata.name}`);
    if (metadata.description) {
      console.log(`    ${metadata.description}`);
    }
    if (metadata.tags && metadata.tags.length > 0) {
      console.log(`    Tags: ${metadata.tags.join(', ')}`);
    }
  });
  
  console.log(`\n📁 Location: ${customDir}`);
  console.log(`\nUse any custom cow with: holy-cow -f <cow-name> "Your message"\n`);
  
  return cowFiles;
}

// Get list of custom cow names
export function getCustomCowNames() {
  const customDir = getCustomCowsDir();
  
  if (!fs.existsSync(customDir)) {
    return [];
  }

  const files = fs.readdirSync(customDir);
  return files
    .filter(f => f.endsWith('.cow'))
    .map(f => path.basename(f, '.cow'));
}

// Get custom cow path
export function getCustomCowPath(name) {
  const customDir = getCustomCowsDir();
  const cowPath = path.join(customDir, `${name}.cow`);
  
  if (fs.existsSync(cowPath)) {
    return cowPath;
  }
  
  return null;
}
