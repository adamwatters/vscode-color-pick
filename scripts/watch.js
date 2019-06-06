const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const config = require('../webpack.config.watch');
const chalk = require('chalk');
// const exec = require('child_process').exec

const compiler = webpack(config);

compiler.watch({
  aggregateTimeout: 300,
  poll: 1000,
  ignored: ['node_modules', '*.test.*', 'scripts/**'],
  cached: true
}, (err, stats) => {
  if(err) {
    console.error(err.stack || err);
    if(err.details) {
      console.error(err.details);
    }
    return;
  }

  console.log('Finished react build!');

  const info = stats.toJson({
    cached: true,
    chunks: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
    performance: true,
    warnings: true
  });

  if (stats.hasErrors()) {
    console.error(chalk.red(info.errors));
  }

  if (stats.hasWarnings()) {
    console.warn(chalk.yellow(info.warnings));
  }

  // const yarnOrNpm = fs.existsSync(path.resolve(process.cwd(), 'yarn.lock')) ? 'yarn' : 'npm';

  // compile ext-src
  // exec(`${yarnOrNpm} run build-ext`, { windowsHide: true },(err, stdout, stderr) => {
  //   if(err) {
  //     console.error(err);
  //     return;
  //   }

  //   console.log('Finished extension build!')

  //   if(stdout) {
  //     console.log(stdout);
  //   }

  //   if(stderr) {
  //     console.error(stderr);
  //   }
  // });
});
