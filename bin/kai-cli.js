#!/usr/bin/env node

'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const program = require('commander');
const readline = require('readline');
const minimatch = require('minimatch');

const MODE_0666 = 0o0666;
const MODE_0755 = 0o0755;

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates');


const { version } = require('../package.json');

program
  .version(version, '-v, --version')
  .usage('[options] [dir]')
  .option('    --db <database>', 'Add <database> support with sequelize (mysql|sqlite|postgres|mssql)')
  .option('-f, --force', 'force on non-empty directory')
  .parse(process.argv);

function createAppName(pathName) {
  return path.basename(pathName)
    .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
    .replace(/^[-_.]+|-+$/g, '')
    .toLowerCase();
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory(p, fn) {
  fs.readdir(p, (err, files) => {
    if (err && err.code !== 'ENOENT') throw err;
    fn(!files || !files.length);
  });
}

/**
 * Prompt for confirmation on STDOUT/STDIN
 */
function confirm(msg, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(msg, (input) => {
    rl.close();
    callback(/^y|yes|ok|true$/i.test(input));
  });
}

/**
 * Make the given dir relative to base.
 *
 * @param {string} base
 * @param {string} dir
 */

function mkdir(base, dir) {
  const loc = path.join(base, dir);

  console.log(`   \x1b[36mcreate\x1b[0m : ${loc}${path.sep}`);
  mkdirp.sync(loc, MODE_0755);
}

/**
 * echo str > file.
 *
 * @param {String} file
 * @param {String} str
 */
function write(file, str, mode) {
  fs.writeFileSync(file, str, { mode: mode || MODE_0666 });
  console.log(`   \x1b[36mcreate\x1b[0m : ${file}`);
}

/**
 * Copy file from template directory.
 */
function copyTemplate(from, to) {
  write(to, fs.readFileSync(path.join(TEMPLATE_DIR, from), 'utf-8'));
}

/**
 * Copy multiple files from template directory.
 */
function copyTemplateMulti(fromDir, toDir, nameGlob) {
  fs.readdirSync(path.join(TEMPLATE_DIR, fromDir))
    .filter(minimatch.filter(nameGlob, { matchBase: true }))
    .forEach((name) => {
      copyTemplate(path.join(fromDir, name), path.join(toDir, name));
    });
}

/**
 * Determine if launched from cmd.exe
 */
function launchedFromCmd() {
  return process.platform === 'win32' &&
    process.env._ === undefined;
}

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */
function createApplication(name, dir) {
  if (dir !== '.') {
    mkdir(dir, '.');
  }
  copyTemplate('core/.gitignore', `${dir}/.gitignore`);
  copyTemplate('core/index.js', `${dir}/index.js`);
  copyTemplate('core/package.json', `${dir}/package.json`);
  mkdir(dir, 'src');
  mkdir(dir, 'src/common');
  copyTemplateMulti('core/src/common', `${dir}/src/common`, '*.js');
  mkdir(dir, 'src/controllers');
  copyTemplateMulti('core/src/controllers', `${dir}/src/controllers`, '*.js');
  mkdir(dir, 'src/middlewares');
  copyTemplateMulti('core/src/middlewares', `${dir}/src/middlewares`, '*.js');
  mkdir(dir, 'test');
  mkdir(dir, 'test/common');
  copyTemplateMulti('core/test/common', `${dir}/test/common`, '*.js');
  mkdir(dir, 'test/controllers');
  copyTemplateMulti('core/test/controllers', `${dir}/test/controllers`, '*.js');
  mkdir(dir, 'test/middlewares');
  copyTemplateMulti('core/test/middlewares', `${dir}/test/middlewares`, '*.js');

  const prompt = launchedFromCmd() ? '>' : '$';

  if (dir !== '.') {
    console.log();
    console.log('   change directory:');
    console.log('     %s cd %s', prompt, dir);
  }

  console.log();
  console.log('   install dependencies:');
  console.log('     %s npm install', prompt);
  console.log();
  console.log('   run the app:');
  console.log('     %s npm start', prompt);
}

function main() {
  const destinationPath = program.args.shift() || '.';
  const appName = createAppName(path.resolve(destinationPath)) || 'hello-world';

  emptyDirectory(destinationPath, (isEmpty) => {
    if (isEmpty || program.force) {
      createApplication(appName, destinationPath);
    } else {
      confirm('destination is not empty, continue? [y/N] ', (ok) => {
        if (ok) {
          process.stdin.destroy();
          createApplication(appName, destinationPath);
        } else {
          console.error('aborting');
          process.exit(1);
        }
      });
    }
  });
}

main();
