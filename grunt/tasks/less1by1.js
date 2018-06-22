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
                                 '\n\n Не могу записать файл. Ошибка: ' +
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

   function buildLessInFolder(folderpath, count, taskName) {
      //count быстро не посчитать

      var progBar = new ProgressBar('   compiling [:bar] :file', {
         complete: '♣',
         incomplete: '_',
         width: 30,
         total: count
      });

      var lessName = grunt.option('name') || '*',
         foundFile = false;

      grunt.log.ok(humanize.date('H:i:s') + ': starts task ' + taskName);
      grunt.log.ok('folder: ' + folderpath);
      if (lessName !== '*') {
         grunt.log.ok('looking for: ' + lessName + '.less');
      }

      var taskDone = this.async();

      helpers.recurse(
         folderpath,
         function(filepath, asyncCallback) {
            var relpath = path.relative(rootPath, filepath);
            if (
               helpers.validateFile(relpath, [
                  'components/**/*.less',
                  'demo/**/*.less',
                  'pages/**/*.less',
                  'Controls-demo/**/*.less',
                  'Controls/**/*.less'
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
               grunt.log.ok('cannot find the file ' + lessName);
            }
            grunt.log.ok(
               humanize.date('H:i:s') + ' : task ' + taskName + ' completed'
            );
            errors.forEach(function(err) {
               grunt.log.error(err);
            });
            errors = [];
            taskDone();
         }
      );
   }

   grunt.registerMultiTask(
      'less1by1',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         buildLessInFolder.call(this, rootPath, 299, 'less1by1');
      }
   );

   grunt.registerMultiTask(
      'lessControls',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         buildLessInFolder.call(
            this,
            rootPath + '\\components',
            179,
            'lessControls'
         );
      }
   );

   grunt.registerMultiTask(
      'lessVDOM',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         buildLessInFolder.call(this, rootPath + '\\Controls', 81, 'lessVDOM');
      }
   );

   grunt.registerMultiTask(
      'lessDemo',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         buildLessInFolder.call(
            this,
            rootPath + '\\Controls-demo',
            38,
            'lessDemo'
         );
      }
   );
};
