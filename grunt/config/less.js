/* global module: false */
module.exports = function(grunt) {
   'use strict';

   var fs = require('fs');
   var merge = require('merge');

   var themesDir = 'themes';
   var themes = fs.readdirSync(themesDir).filter(function(name) {
      return grunt.file.isDir(themesDir + '/' + name);
   });

   var fileOptions;
   var devFiles = [];
   var prodFiles = [];
   themes.forEach(function(theme) {
      fileOptions = {
         expand: true,
         cwd: themesDir + '/' + theme,
         src: theme + '.less',
         dest: themesDir + '/' + theme
      };
      devFiles.push(merge({}, fileOptions, {
         ext: '.css'
      }));
      prodFiles.push(merge({}, fileOptions, {
         ext: '.min.css'
      }));
   });

   return {
      options: {
         cleancss: true,
         strictImports: true
      },
      development: {
         options: {
            compress: false
         },
         files: devFiles
      },
      production: {
         options: {
            compress: true
         },
         files: prodFiles
      }
   };
};