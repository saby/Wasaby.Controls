'use strict';
const helpers = require('./helpers'),
   fs = require('fs'),
   path = require('path'),
   humanize = require('humanize'),
   ProgressBar = require('progress'),
   less = require('less'),
   postcss = require('postcss'),
   autoprefixer = require('autoprefixer'),
   DEFAULT_THEME = 'online',
   async = require('async');

let errors = [];

module.exports = function less1by1Task(grunt) {
   let root = grunt.option('root') || '',
      app = grunt.option('application') || '',
      rootPath = path.join(root, app),
      themesPath = path.join(rootPath, './SBIS3.CONTROLS/themes/');

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
                           progBar.tick(1, {
                              file: newName
                           });
                           asyncCallback();
                        }
                     );
                  });
            } else {
               progBar.tick(1, {
                  file: newName
               });
               asyncCallback();
            }
         }
      );
   }

   function buildLessInFolder(folderpath, taskName, taskDone, findFileName) {
      var files = [];
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
                  'Controls-theme/**/' + findFileName + '.less',
                  'SBIS3.CONTROLS/**/' + findFileName + '.less',
                  'demo/**/' + findFileName + '.less',
                  'pages/**/' + findFileName + '.less',
                  'Controls-demo/**/' + findFileName + '.less',
                  'Controls/**/' + findFileName + '.less',
                  'Examples/**/' + findFileName + '.less'
               ])
            ) {
               fs.readFile(filepath, function readFileCb(readFileError, data) {
                  if (filepath.indexOf('\\_') === -1) {
                     files.push({ data: data, path: filepath });
                  }
                  asyncCallback();
               });
            } else {
               asyncCallback();
            }
         },
         function() {
            if (!files.length) {
               grunt.log.ok('Cannot find the file ' + findFileName);
               errors = [];
               taskDone();
               return;
            }
            var progBar = new ProgressBar('   compiling [:bar] :file', {
               complete: '♣',
               incomplete: '_',
               width: 30,
               total: files.length
            });
            async.eachLimit(
               files,
               10,
               function(file, asyncCallback) {
                  processLessFile(file.data, file.path, progBar, asyncCallback);
               },
               function() {
                  errors.forEach(function(err) {
                     grunt.log.error(err);
                  });

                  grunt.log.ok(
                     humanize.date('H:i:s') +
                        ': task ' +
                        taskName +
                        ' completed'
                  );

                  //todo
                  if (errors.length) {
                     errors = [];
                     taskDone(true);
                  } else {
                     errors = [];
                     taskDone();
                  }
               }
            );
         }
      );
   }

   function createAsyncThemeBuilder(taskDone) {
      return function(wasErrors) {
         if (wasErrors) {
            taskDone();
         } else {
            buildLessInFolder(
               rootPath + '\\components\\themes',
               'ThemesBuild',
               taskDone
            );
         }
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
         buildLessInFolder(rootPath, 'less1by1', asyncCallback, findFileName);
      }
   );

   grunt.registerMultiTask(
      'lessControls',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         buildLessInFolder(
            rootPath + '\\components',
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
            'lessExamples',
            createAsyncThemeBuilder(this.async())
         );
      }
   );
   grunt.registerMultiTask(
      'lessAll',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         buildLessInFolder(
            rootPath,
            'lessAll',
            createAsyncThemeBuilder(this.async())
         );
      }
   );
};
