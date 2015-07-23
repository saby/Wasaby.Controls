/* global module, process */
module.exports = function (grunt) {
   'use strict';

   var childProcess = require('child_process'),
      StringDecoder = require('string_decoder').StringDecoder,
      path = require('path'),
      config = grunt.config('unit-tests'),
      webdriver = require(path.join(process.cwd(), config.path + 'lib/webdriver')),
      defTimeout = config.timeout,
      runTest = function (done, name, options, args) {
         options = options || {};
         args = args || [];
         var command = arguments[4] || 'node';

         var execMethod = command == 'node' ? 'spawn' : 'execFile',
            defOptions = {
               timeout: defTimeout
            };
         for (var key in defOptions) {
            if (defOptions.hasOwnProperty(key)) {
               if (!(key in options)) {
                  options[key] = defOptions[key];
               }
            }
         }

         args.push(config.path + name);
         var testing = childProcess[execMethod](
            command,
            args,
            options
         );
         testing.stdout.on('data', function (data) {
            var decoder = new StringDecoder();
            grunt.log.ok(decoder.write(data));
         });
         testing.stderr.on('data', function (data) {
            var decoder = new StringDecoder();
            grunt.fail.fatal(decoder.write(data));
         });
         testing.on('error', function (err) {
            grunt.fail.fatal(err);
         });
         testing.on('close', function (code) {
            done(code);
         });
      };

   grunt.registerTask('tests-install-packages', function () {
      var done = this.async(),
         pckgStack = [],
         installPackage = function (name, version, callback) {
            grunt.log.writeln('installing package ' + name);
            childProcess.exec('npm install ' + name + '@' + version, function (err, stdout, stderr) {
               if (err) {
                  grunt.fail.fatal(err);
               }
               var decoder = new StringDecoder();
               if (stderr) {
                  grunt.log.error(decoder.write(stderr));
               }
               if (stdout) {
                  grunt.log.ok(decoder.write(stdout));
               }
               callback();
            });
         },
         installNext = function () {
            var item = pckgStack.shift();
            if (!item) {
               done();
               return;
            }
            if (grunt.file.isDir('node_modules/' + item.name)) {
               installNext();
            } else {
               installPackage(item.name, item.ver, function () {
                  installNext();
               });
            }
         };

      for (var packageName in config.packages) {
         if (config.packages.hasOwnProperty(packageName)) {
            if (packageName === 'selenium-standalone' && !webdriver.Provider.isManualMode()) {
               continue;
            }
            pckgStack.push({
               name: packageName,
               ver: config.packages[packageName]
            });
         }
      }

      installNext();
   });

   grunt.registerTask('tests-setup-packages', function () {
      webdriver.Provider.installServer(this.async());
   });

   grunt.registerTask('tests-list-build', function () {
      runTest(this.async(), 'list.build');
   });

   grunt.registerTask('tests-webdriver[main]', function () {
      grunt.task.requires('tests-install-packages');
      grunt.task.requires('tests-setup-packages');
      grunt.task.requires('js');
      grunt.task.requires('express:development');
      runTest(this.async(), 'via-webdriver.run');
   });

   grunt.registerTask('tests-webdriver', [
      'tests-install-packages',
      'tests-setup-packages',
      'tests-list-build',
      'js',
      'express:development',
      'tests-webdriver[main]'
   ]);

   grunt.registerTask('tests-isolated[main]', function () {
      grunt.task.requires('js');
      runTest(
         this.async(),
         'via-isolated.run',
         {},
         config.mocha.args,
         config.mocha.path
      );
   });

   grunt.registerTask('tests-isolated', [
      'js',
      'tests-isolated[main]'
   ]);

   grunt.registerTask('tests-coverage[main]', function () {
      grunt.task.requires('tests-install-packages');
      grunt.task.requires('tests-setup-packages');
      grunt.task.requires('js');
      grunt.task.requires('express:development');
      runTest(this.async(), 'jscoverage.run');
   });

   grunt.registerTask('tests-coverage', [
      'tests-install-packages',
      'tests-setup-packages',
      'tests-list-build',
      'js',
      'express:development',
      'tests-coverage[main]'
   ]);

   grunt.registerTask('tests', [
      'tests-install-packages',
      'tests-setup-packages',
      'tests-list-build',
      'js',
      'express:development',
      'tests-webdriver[main]',
      'tests-coverage[main]'
   ]);
};