'use strict';
const helpers = require('./helpers'),
   fs = require('fs'),
   path = require('path'),
   humanize = require('humanize'),
   ProgressBar = require('progress'),
   less = require('less'),
   postcss = require('postcss'),
   autoprefixer = require('autoprefixer'),
   DEFAULT_THEME = 'online';

let errors = [];

module.exports = function less1by1Task(grunt) {
   let root = grunt.option('root') || '',
      app = grunt.option('application') || '',
      rootPath = path.join(root, app),
      themesPath = path.join(rootPath, './components/themes/');

   function processLessFile(data, filePath, progBar, asyncCallback) {
      let lessData = data.toString(),
         imports = `
            @import '${themesPath}${DEFAULT_THEME}/_variables';
            @import '${themesPath}_mixins';
            @themeName: ${DEFAULT_THEME};
            `;
      less.render(
         imports + lessData,
         {
            filename: filePath,
            cleancss: false,
            relativeUrls: true,
            strictImports: true
         },
         function writeCSS(compileLessError, output) {
            if (compileLessError) {
               errors.push(
                  `\n\n ${compileLessError.message} in file: ${
                     compileLessError.filename
                  } on line: ${compileLessError.line}`
               );
            }

            let newName = `${path.dirname(filePath)}\\${path.basename(
               filePath,
               '.less'
            )}.css`;

            if (output) {
               const postcssOptions = {
                  from: null //глушу warning postcss про генерацию source map. Все равно локально они нам не нужны
               };
               postcss([
                  autoprefixer({ browsers: ['last 2 versions', 'ie>=10'] })
               ])
                  .process(output.css, postcssOptions)
                  .then(function(postcssOutput) {
                     fs.writeFile(
                        newName,
                        postcssOutput.css,
                        function writeFileCb(writeFileError) {
                           if (writeFileError) {
                              errors.push(
                                 '\n\n Cannot write the file. Error: ' +
                                    writeFileError.message +
                                    '}.'
                              );
                           }
                           if (progBar) {
                              progBar.tick(1, {
                                 file: newName
                              });
                           } else {
                              grunt.log.ok('   compiling ' + newName);
                           }
                           asyncCallback();
                        }
                     );
                  });
            } else {
               if (progBar) {
                  progBar.tick(1, {
                     file: newName
                  });
               } else {
                  grunt.log.error('   Cannot compile the file ' + newName);
               }
               asyncCallback();
            }
         }
      );
   }

   function buildLessInFolder(
      folderpath,
      count,
      taskName,
      taskDone,
      findFileName
   ) {
      //todo: отказаться от count

      var progBar =
            !findFileName &&
            new ProgressBar('   compiling [:bar] :file', {
               complete: '♣',
               incomplete: '_',
               width: 30,
               total: count
            }),
         foundFile = false;
      findFileName = findFileName || '*';
      if (findFileName !== '*') {
         grunt.log.ok('looking for ' + findFileName + '.less');
      } else {
         grunt.log.ok(
            humanize.date('H:i:s') +
               ': starts task ' +
               taskName +
               ' at folder ' +
               folderpath
         );
      }

      helpers.recurse(
         folderpath,
         function(filepath, asyncCallback) {
            var relpath = path.relative(rootPath, filepath);
            if (
               helpers.validateFile(relpath, [
                  'components/**/' + findFileName + '.less',
                  'demo/**/' + findFileName + '.less',
                  'pages/**/' + findFileName + '.less',
                  'Controls-demo/**/' + findFileName + '.less',
                  'Controls/**/' + findFileName + '.less',
                  'Examples/**/' + findFileName + '.less'
               ])
            ) {
               foundFile = true;
               fs.readFile(filepath, function readFileCb(readFileError, data) {
                  if (filepath.indexOf('\\_') === -1) {
                     processLessFile(data, filepath, progBar, asyncCallback);
                  } else {
                     asyncCallback();
                  }
               });
            } else {
               asyncCallback();
            }
         },
         function() {
            if (!foundFile) {
               grunt.log.ok('Cannot find the file ' + findFileName);
            }
            errors.forEach(function(err) {
               grunt.log.error(err);
            });

            grunt.log.ok(
               humanize.date('H:i:s') + ': task ' + taskName + ' completed'
            );
            errors = [];
            taskDone();
         }
      );
   }

   function createAsyncThemeBuilder(taskDone) {
      return function() {
         buildLessInFolder(
            rootPath + '\\components\\themes',
            19,
            'ThemesBuild',
            taskDone
         );
      };
   }

   grunt.registerMultiTask(
      'less1by1',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         var findFileName = grunt.option('name'),
            withThemes =
               grunt.option('withThemes') === undefined
                  ? true
                  : grunt.option('withThemes'),
            asyncCallback =
               findFileName && withThemes
                  ? createAsyncThemeBuilder(this.async())
                  : this.async();
         buildLessInFolder(
            rootPath,
            299,
            'less1by1',
            asyncCallback,
            findFileName
         );
      }
   );

   grunt.registerMultiTask(
      'lessControls',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         buildLessInFolder(
            rootPath + '\\components',
            179,
            'lessControls',
            this.async()
         );
      }
   );

   grunt.registerMultiTask(
      'lessVDOM',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         buildLessInFolder(
            rootPath + '\\Controls',
            81,
            'lessVDOM',
            createAsyncThemeBuilder(this.async())
         );
      }
   );

   grunt.registerMultiTask(
      'lessDemo',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         buildLessInFolder(
            rootPath + '\\Controls-demo',
            38,
            'lessDemo',
            createAsyncThemeBuilder(this.async())
         );
      }
   );
   grunt.registerMultiTask(
      'lessExamples',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         buildLessInFolder(
            rootPath + '\\Examples',
            6,
            'lessExamples',
            createAsyncThemeBuilder(this.async())
         );
      }
   );
};
