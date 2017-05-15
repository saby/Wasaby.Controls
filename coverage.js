#!/usr/bin/env node

/**
 * This wrapper runs coverage in valid environment
 */

var spawn = require('child_process').spawn,
   path = require('path'),
   fs = require('fs'),
   args = ['node_modules/istanbul/lib/cli', 'cover', 'node_modules/mocha/bin/_mocha'];

args.push.apply(args, process.argv.slice(2));

var proc = spawn(
   process.execPath,
   args,
   {stdio: 'inherit'}
);
proc.on('exit', function (code, signal) {
   process.on('exit', function() {
      if (signal) {
         process.kill(process.pid, signal);
      } else {
         process.exit(code);
      }
   });
});

// terminate children.
process.on('SIGINT', function () {
   proc.kill('SIGINT');
   proc.kill('SIGTERM');
   process.kill(process.pid, 'SIGINT');
});
