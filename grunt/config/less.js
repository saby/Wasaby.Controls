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
   var normalFiles = [];
   var compressedFiles = [];

   var theme = grunt.option('theme');
   if (theme) {
      themes = [theme];
   }

   themes.forEach(function(theme) {
      fileOptions = {
         expand: true,
         cwd: themesDir + '/' + theme,
         src: theme + '.less',
         dest: themesDir + '/' + theme
      };
      normalFiles.push(merge({}, fileOptions, {
         ext: '.css'
      }));
      compressedFiles.push(merge({}, fileOptions, {
         ext: '.min.css'
      }));
   });

   return {
      options: {
         cleancss: true,
         strictImports: true
      },
      normal: {
         options: {
            compress: false
         },
         files: normalFiles
      },
      compress: {
         options: {
            compress: true
         },
         files: compressedFiles
      }
   };
};