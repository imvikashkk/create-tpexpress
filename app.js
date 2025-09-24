#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

/* Colors for console output */
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  magenta: '\x1b[35m',
};

/* Enhanced logging with better formatting */
function log(message, color = 'reset', prefix = '') {
  const colorCode = colors[color] || colors.reset;
  console.log(`${colorCode}${prefix}${message}${colors.reset}`);
}

function showBanner() {
  console.log(`
${colors.cyan}${colors.bold}
╭─────────────────────────────────────────────────────╮
│                 CREATE-TPEXPRESS 🚀                 │
│      TypeScript + Node.js + Express.js Scaffolder   │
╰─────────────────────────────────────────────────────╯

████████╗██████╗ ███████╗██╗  ██╗██████╗ ██████╗ ███████╗███████╗███████╗
╚══██╔══╝██╔══██╗██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝
   ██║   ██████╔╝█████╗   ╚███╔╝ ██████╔╝██████╔╝█████╗  ███████╗███████╗
   ██║   ██╔═══╝ ██╔══╝   ██╔██╗ ██╔═══╝ ██╔══██╗██╔══╝  ╚════██║╚════██║
   ██║   ██║     ███████╗██╔╝ ██╗██║     ██║  ██║███████╗███████║███████║
   ╚═╝   ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝
${colors.reset}
  `);
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

  if (majorVersion < 22) {
    log(`Node.js version ${nodeVersion} is not supported.`, 'red', '❌ ');
    log(`Required: Node.js v22.19.0 or higher`, 'yellow', '📋 ');
    log(`Please upgrade Node.js: https://nodejs.org/`, 'blue', '📥 ');
    process.exit(1);
  }

  log(`Node.js ${nodeVersion} - Compatible!`, 'green', '✅ ');
}

function validateProjectName(name) {
  if (!name || name.trim() === '') {
    return false;
  }

  if (name === '.') {
    return true;
  }

  if (!/^[a-z0-9-_.]+$/i.test(name)) {
    log('Invalid project name!', 'red', '❌ ');
    log(
      'Use only letters, numbers, hyphens, underscores, and dots',
      'yellow',
      '📋 '
    );
    return false;
  }

  return true;
}

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function promptForProjectName(rl) {
  return new Promise((resolve) => {
    console.log();
    log('Where do you want to create your project?', 'cyan', '📝 ');
    log('Default: "my-app" (Press Enter to use default)', 'dim', '   ');
    console.log();

    rl.question(
      `${colors.cyan}📁 Project location: ${colors.reset}`,
      (answer) => {
        const input = answer.trim();

        if (input === '') {
          resolve('my-app');
        } else if (input === '.') {
          resolve('.');
        } else {
          resolve(input);
        }
      }
    );
  });
}

async function promptForDatabase() {
  const databaseOptions = [
    {
      name: 'MongoDB with Mongoose',
      value: 'mongoose',
      color: 'green',
      description: '(NoSQL database with elegant ODM)',
    },
    {
      name: 'Drizzle with PostgreSQL',
      value: 'drizzle',
      color: 'blue',
      description: '(Modern TypeScript ORM)',
    },
    {
      name: 'Prisma with PostgreSQL',
      value: 'prisma',
      color: 'magenta',
      description: '(Auto-generated type-safe client)',
    },
    {
      name: 'Plain PostgreSQL',
      value: 'postgres',
      color: 'blue',
      description: '(Raw SQL with pg driver)',
    },
  ];

  let selectedIndex = 0;

  // Show selection header with some spacing from banner
  console.log();
  console.log();
  log('Select a database:', 'green');
  log('(Use arrow keys)', 'dim');
  console.log();

  // Show initial options (dimmed)
  databaseOptions.forEach((option) => {
    console.log(
      `  ${colors.dim}${option.name}${colors.reset} ${colors.dim}${option.description}${colors.reset}`
    );
  });
  console.log();

  // Hide cursor
  process.stdout.write('\x1b[?25l');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  readline.emitKeypressEvents(process.stdin);

  return new Promise((resolve) => {
    function render() {
      // Move cursor up to the start of options (not header)
      process.stdout.write(`\x1b[${databaseOptions.length + 1}A`);

      // Clear from cursor down
      process.stdout.write('\x1b[0J');

      databaseOptions.forEach((option, index) => {
        const isSelected = index === selectedIndex;

        if (isSelected) {
          // Vite-style selected option
          const optionColor = colors[option.color] || colors.blue;
          console.log(
            `${colors.green}✔${colors.reset} ${optionColor}${option.name}${colors.reset}`
          );
        } else {
          // Vite-style unselected option
          console.log(
            `  ${colors.dim}${option.name}${colors.reset} ${colors.dim}${option.description}${colors.reset}`
          );
        }
      });

      console.log(); // Extra spacing
    }

    // Initial selection render
    render();

    function cleanup() {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeAllListeners('keypress');
      process.stdout.write('\x1b[?25h'); // Show cursor
    }

    process.stdin.on('keypress', (chunk, key) => {
      if (key && key.name === 'up') {
        selectedIndex =
          (selectedIndex - 1 + databaseOptions.length) % databaseOptions.length;
        render();
      } else if (key && key.name === 'down') {
        selectedIndex = (selectedIndex + 1) % databaseOptions.length;
        render();
      } else if (key && key.name === 'return') {
        cleanup();

        // Clear only the options area, not the header
        process.stdout.write(`\x1b[${databaseOptions.length + 1}A`);
        process.stdout.write('\x1b[0J');

        const selected = databaseOptions[selectedIndex];
        const optionColor = colors[selected.color] || colors.blue;
        console.log(
          `${colors.green}✔${colors.reset} ${optionColor}${selected.name}${colors.reset}`
        );
        console.log();
        console.log();

        resolve(selected.value);
      } else if (key && key.ctrl && key.name === 'c') {
        cleanup();
        console.log();
        log('Installation cancelled by user.', 'yellow', '👋 ');
        process.exit(0);
      }
    });
  });
}

function copyFiles(src, dest, projectName, isCurrentDir) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip database template subdirectories when copying base template
      if (
        src === path.join(import.meta.dirname, 'templates') &&
        ['drizzle', 'mongoose', 'prisma', 'postgres'].includes(entry.name)
      ) {
        continue;
      }
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyFiles(srcPath, destPath, projectName, isCurrentDir);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');

      // Replace placeholder project name in package.json
      if (entry.name === 'package.json') {
        const actualProjectName = isCurrentDir
          ? path.basename(process.cwd())
          : projectName;
        content = content.replace(
          /"name": "create-tpexpress"/,
          `"name": "${actualProjectName}"`
        );
      }

      fs.writeFileSync(destPath, content);
    }
  }
}

function createProjectFromTemplate(
  targetPath,
  projectName,
  isCurrentDir,
  databaseType
) {
  const templatePath = path.join(import.meta.dirname, 'templates');

  // Step 1: Copy core template files
  log('Copying core template files...', 'yellow', '📂 ');
  copyFiles(templatePath, targetPath, projectName, isCurrentDir);
  log('Core template files copied!', 'green', '✅ ');

  // Step 2: Copy database-specific template files
  log(`Copying ${databaseType} template files...`, 'yellow', '📂 ');
  const dbTemplatePath = path.join(templatePath, databaseType);

  if (!fs.existsSync(dbTemplatePath)) {
    log(
      `Database template directory for "${databaseType}" not found!`,
      'red',
      '❌ '
    );
    process.exit(1);
  }

  copyFiles(dbTemplatePath, targetPath, projectName, isCurrentDir);
  log(`${databaseType} template files copied!`, 'green', '✅ ');
}

function checkCurrentDirEmpty() {
  const files = fs.readdirSync(process.cwd());
  const importantFiles = files.filter(
    (file) =>
      !file.startsWith('.') &&
      file !== 'node_modules' &&
      !['README.md', 'LICENSE', '.gitignore'].includes(file)
  );

  return importantFiles.length === 0;
}

function promptForCurrentDirInstall(rl) {
  return new Promise((resolve) => {
    const currentDir = path.basename(process.cwd());
    console.log();
    log(`Current directory "${currentDir}" is not empty!`, 'yellow', '⚠️  ');
    log('Contents will be mixed with template files.', 'yellow', '📁 ');
    console.log();

    rl.question(
      `${colors.cyan}Continue anyway? (y/N): ${colors.reset}`,
      (answer) => {
        const response = answer.toLowerCase().trim();
        resolve(response === 'y' || response === 'yes');
      }
    );
  });
}

function renameSpecialFiles(targetPath) {
  // Rename gitignore file
  const gitignoreFiles = [
    { from: 'gitignore.template', to: '.gitignore' },
    { from: 'env.template', to: '.env' },
  ];

  gitignoreFiles.forEach(({ from, to }) => {
    const srcFile = path.join(targetPath, from);
    const destFile = path.join(targetPath, to);

    if (fs.existsSync(srcFile)) {
      try {
        fs.renameSync(srcFile, destFile);
      } catch {
        fs.writeFileSync(destFile, fs.readFileSync(srcFile, 'utf8'), 'utf8');
        fs.unlinkSync(srcFile);
      }
    }
  });
}

function installDependencies(projectPath) {
  log('Installing dependencies...', 'yellow', '📦 ');

  try {
    const currentDir = process.cwd();
    process.chdir(projectPath);

    // Use inherit to show npm install progress
    execSync('npm install', { stdio: 'inherit' });

    log('Dependencies installed successfully!', 'green', '✅ ');
    process.chdir(currentDir);
  } catch (error) {
    log('Failed to install dependencies:', 'red', '❌ ');
    log(error.message, 'red', '   ');
    log(
      'You can install them manually by running: npm install',
      'yellow',
      '💡 '
    );
  }
}

function showSuccessMessage(projectName, isCurrentDir = false) {
  const cdCommand = isCurrentDir ? '' : `cd ${projectName}`;

  console.log(`
${colors.green}${colors.bold}🎉 Project created successfully!${colors.reset}

${colors.blue}📁 Location: ${colors.bold}${
    isCurrentDir ? 'Current directory' : projectName
  }${colors.reset}

${colors.cyan}📋 Next steps:${colors.reset}
${cdCommand ? `  ${colors.yellow}${cdCommand}${colors.reset}` : ''}
  ${colors.yellow}npm run dev${colors.reset}        ${
    colors.dim
  }# Start development server${colors.reset}
  ${colors.yellow}npm run build${colors.reset}      ${
    colors.dim
  }# Build for production${colors.reset}
  ${colors.yellow}npm run start${colors.reset}      ${
    colors.dim
  }# Run production build${colors.reset}

${colors.cyan}📚 Available Scripts:${colors.reset}
  ${colors.green}npm run dev${colors.reset}         ${
    colors.dim
  }Development with hot reload${colors.reset}
  ${colors.green}npm run build${colors.reset}       ${
    colors.dim
  }Production build${colors.reset}  
  ${colors.green}npm run start${colors.reset}       ${
    colors.dim
  }Run production server${colors.reset}
  ${colors.green}npm run lint${colors.reset}        ${
    colors.dim
  }Check code style${colors.reset}
  ${colors.green}npm run format${colors.reset}      ${colors.dim}Format code${
    colors.reset
  }
  ${colors.green}npm run check${colors.reset}       ${
    colors.dim
  }Run all checks${colors.reset}

${colors.magenta}🚀 Happy coding!${colors.reset}
  `);
}

async function main() {
  try {
    showBanner();
    checkNodeVersion();

    let projectName = process.argv[2];
    let rl;

    // Get project name if not provided
    if (!projectName) {
      rl = createReadlineInterface();
      projectName = await promptForProjectName(rl);
      rl.close();
    }

    // Validate project name
    if (!validateProjectName(projectName)) {
      log('Invalid project name provided!', 'red', '❌ ');
      process.exit(1);
    }

    // Database selection with improved UI
    const databaseType = await promptForDatabase();

    const currentDir = process.cwd();
    let targetPath;
    let isCurrentDir = false;

    // Handle installation directory
    if (projectName === '.') {
      isCurrentDir = true;
      targetPath = currentDir;

      if (!checkCurrentDirEmpty()) {
        rl = createReadlineInterface();
        const shouldContinue = await promptForCurrentDirInstall(rl);
        rl.close();

        if (!shouldContinue) {
          log('Installation cancelled by user.', 'yellow', '❌ ');
          process.exit(0);
        }
      }

      log('Setting up TypeScript project in current directory', 'blue', '🏗️  ');
    } else {
      targetPath = path.join(currentDir, projectName);

      if (fs.existsSync(targetPath)) {
        log(`Directory "${projectName}" already exists!`, 'red', '❌ ');
        log(
          'Please choose a different name or remove the existing directory',
          'yellow',
          '💡 '
        );
        process.exit(1);
      }

      log(`Creating project: ${projectName}`, 'blue', '🏗️  ');
    }

    // Create project directory
    if (!isCurrentDir) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    // Create project from templates
    createProjectFromTemplate(
      targetPath,
      projectName,
      isCurrentDir,
      databaseType
    );

    // Rename special files
    renameSpecialFiles(targetPath);

    // Install dependencies
    installDependencies(targetPath);

    // Show success message
    showSuccessMessage(projectName, isCurrentDir);
  } catch (error) {
    log('Failed to create project:', 'red', '❌ ');
    log(error.message, 'red', '   ');
    process.exit(1);
  }
}

/* Enhanced error handling */
process.on('uncaughtException', (error) => {
  console.log();
  log('Unexpected error occurred:', 'red', '❌ ');
  log(error.message, 'red', '   ');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.log();
  log('Unhandled promise rejection:', 'red', '❌ ');
  log(reason, 'red', '   ');
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log();
  log('Installation cancelled by user.', 'yellow', '👋 ');
  process.exit(0);
});

// Run the main function
main();
