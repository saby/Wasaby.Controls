/* global module, process */
module.exports = function (grunt) {
   'use strict';

   var StringDecoder = require('string_decoder').StringDecoder,
      path = require('path'),
      config = grunt.config('unit-tests'),
      webdriver = require(path.join(process.cwd(), config.path + 'lib/webdriver')),
      runScript = function (done, name, args) {
         args = args || [];
         args.push(config.path + name);

         grunt.log.writeln('run node script: ' + args.join(' '));
         checkResults(grunt.util.spawn({
            cmd: 'node',
            args: args
         }, done));
      },
      runCommand = function (done, name, args) {
         args = args || [];

         //name = path.resolve(process.cwd(), name);
         grunt.log.writeln('executing: ' + name + ' ' + args.join(' '));
         checkResults(grunt.util.spawn({
            cmd: name,
            args: args,
            opts: {
               cwd: process.cwd()
            }
         }, done));
      },
      checkResults = function(proc) {
         proc.stdout.on('data', function (data) {
            var decoder = new StringDecoder();
            grunt.log.ok(decoder.write(data));
         });
         proc.stderr.on('data', function (data) {
            var decoder = new StringDecoder();
            grunt.fail.warn(decoder.write(data));
         });
         proc.on('error', function (err) {
            grunt.fail.fatal(err);
         });
      };

   grunt.registerTask('tests-install-packages', function () {
      var done = this.async(),
         pckgStack = [],
         installPackage = function (name, version, callback) {
            grunt.log.writeln('installing package ' + name);
            checkResults(grunt.util.spawn({
               cmd: 'npm install ' + name + '@' + version
            }, callback));
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
      runScript(this.async(), 'list.build');
   });

   grunt.registerTask('tests-webdriver[main]', function () {
      grunt.task.requires('tests-install-packages');
      grunt.task.requires('tests-setup-packages');
      grunt.task.requires('js');
      grunt.task.requires('express:development');
      runScript(this.async(), 'via-webdriver.run');
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
      var cfg = config.mocha.slice();
      cfg.push(config.path + 'coverage.run');
      runCommand(
         this.async(),
         'mocha',
         cfg
      );
   });

   grunt.registerTask('tests-isolated', [
      'js',
      'tests-isolated[main]'
   ]);

   grunt.registerTask('tests-coverage[main]', function () {
      grunt.task.requires('tests-install-packages');
      grunt.task.requires('js');
      runCommand(
         this.async(),
         'coverage',
         [config.path + 'coverage.run']
      );
   });

   grunt.registerTask('tests-coverage', [
      'tests-install-packages',
      'tests-list-build',
      'js',
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