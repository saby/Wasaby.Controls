/* global module: false, global: false, JSON: false */
module.exports = function(grunt) {
   'use strict';

   var fs = require('fs'),
       path = require('path');

   grunt.registerTask('build-dependencies', function() {
      var
         newPath,
         jsModules = {},
         gruntFilePath = path.resolve(),
         resourcesBaseDir = path.join(gruntFilePath, 'components'),
         dirWalker = function(dir) {
            newPath = '';
            var files = fs.readdirSync(dir);
            for (var i = 0; i < files.length; i++){
               newPath = path.join(dir, files[i]);
               if (fs.statSync(newPath).isDirectory()){
                  dirWalker(newPath);
               }
               else {
                  if (/\.module\.js$/.test(files[i])){
                     require(newPath);
                  }
               }
            }
         };

      var restoreDefine = global.define;
      global.define = function(name){
         jsModules[name.replace(/js!/,'')] = '/' + path.relative(resourcesBaseDir, newPath).replace(/\\/g,'/');
      };
      dirWalker(resourcesBaseDir);
      global.define = restoreDefine;

      var jsModulesJsonString = JSON.stringify({jsModules: jsModules}, null, 3);
      fs.writeFileSync(path.join(gruntFilePath, 'components/contents.json'), jsModulesJsonString);
      fs.writeFileSync(path.join(gruntFilePath, 'components/contents.js'), 'contents = ' + jsModulesJsonString + ';');
      grunt.log.writeln('Contents files are built.');
   });
};