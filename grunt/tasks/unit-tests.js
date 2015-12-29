/* global module, process */
module.exports = function (grunt) {
   'use strict';

   var childProcess = require('child_process'),
      StringDecoder = require('string_decoder').StringDecoder,
      path = require('path'),
      config = grunt.config('unit-tests'),
      webdriver = require(path.join(process.cwd(), config.path + 'lib/webdriver')),
      runScript = function (done, name, args) {
         args = args || [];
         args.push(config.path + name);

         grunt.log.writeln('run node script: ' + args.join(' '));
         checkResults(childProcess.spawn(
            'node',
            args
         ), done);
      },
      runCommand = function (done, name, args) {
         args = args || [];

         //name = path.resolve(process.cwd(), name);
         name = name + ' ' + args.join(' ');
         grunt.log.writeln('executing: ' + name);
         checkResults(childProcess.exec(name, {
            cwd: process.cwd()
         }), done);
      },
      checkResults = function(proc, done) {
         proc.stdout.on('data', function (data) {
            var decoder = new StringDecoder();
            grunt.log.ok(decoder.write(data));
         });
         proc.stderr.on('data', function (data) {
            var decoder = new StringDecoder();
            grunt.fail.fatal(decoder.write(data));
         });
         proc.on('error', function (err) {
            grunt.fail.fatal(err);
         });
         proc.on('close', function (code) {
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
         [config.path + 'via-isolated.run']
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