#!/usr/bin/env node

/**
 * This wrapper runs mocha in valid environment
 */

var spawn = require('child_process').spawn,
   path = require('path'),
   fs = require('fs'),
   args = ['node_modules/mocha/bin/mocha'];

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
