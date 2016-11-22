#!/usr/bin/env node

/**
 * Call scripts in queue
 */

var spawn = require('child_process').spawn,
   path = require('path'),
   fs = require('fs'),
   scripts = process.argv.slice(2),
   processes = [],
   finished = [],
   finishEarly = function(index) {
      if (index === undefined) {
         index = processes.length;
      }
      processes.slice(0, index).forEach(function(proc) {
         proc.kill('SIGINT');
         proc.kill('SIGTERM');
      });
   };

// run children
scripts.forEach(function(script, index) {
   var proc = spawn(
      process.execPath,
      [script],
      {stdio: 'inherit'}
   );

   processes.push(proc);

   proc.on('exit', function (code, signal) {
      finished.push({
         script: script,
         index: index,
         code: code,
         signal: signal
      });
      // finish previous
      finishEarly(index);
   });
});

// check latest finished child
process.on('exit', function() {
   var last = finished.pop();
   if (last) {
      if (last.signal) {
         process.kill(process.pid, last.signal);
      } else {
         process.exit(last.code);
      }
   }
});

// terminate children on exit.
process.on('SIGINT', function () {
   finishEarly();
   process.kill(process.pid, 'SIGINT');
});
