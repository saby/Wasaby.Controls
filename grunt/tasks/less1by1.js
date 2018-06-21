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

const bar = new ProgressBar('  compiling [:bar] :file', {
   complete: '♥',
   incomplete: '_',
   width: 30,
   total: 299
});

module.exports = function less1by1Task(grunt) {
   let root = grunt.option('root') || '',
      app = grunt.option('application') || '',
      rootPath = path.join(root, app),
      themesPath = path.join(rootPath, './components/themes/');

   function processLessFile(data, filePath) {
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

            let newName = `${path.dirname(filePath)}/${path.basename(
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
                  .then(postcssOutput => {
                     fs.writeFile(
                        newName,
                        postcssOutput.css,
                        function writeFileCb(writeFileError) {
                           if (writeFileError) {
                              errors.push(
                                 `\n\n Не могу записать файл. Ошибка: ${
                                    writeFileError.message
                                 }.`
                              );
                           }
                           bar.tick(1, {
                              file: newName
                           });
                        }
                     );
                  });
            }
         }
      );
   }

   grunt.registerMultiTask(
      'less1by1',
      'Компилит каждую лесску, ложит cssку рядом. Умеет в темы',
      function() {
         let lessName = grunt.option('name') || '*',
            foundFile = false;

         grunt.log.ok(
            `\n\n ${humanize.date('H:i:s')} : Запускается задача less1by1.`
         );

         if (lessName !== '*') {
            grunt.log.ok(`Ищем файл: ${lessName}.less`);
         }


         let taskDone = this.async();
         helpers.recurse(
            rootPath,
            function(filepath, cb) {
               let relpath = path.relative(rootPath, filepath);
               if (
                  helpers.validateFile(relpath, [
                     `components/**/${lessName}.less`
                  ]) ||
                  helpers.validateFile(relpath, [`demo/**/${lessName}.less`]) ||
                  helpers.validateFile(relpath, [
                     `pages/**/${lessName}.less`
                  ]) ||
                  helpers.validateFile(relpath, [
                     `Controls-demo/**/${lessName}.less`
                  ]) ||
                  helpers.validateFile(relpath, [
                     `Controls/**/${lessName}.less`
                  ])
               ) {
                  foundFile = true;
                  fs.readFile(filepath, function readFileCb(
                     readFileError,
                     data
                  ) {


                     if (!~filepath.indexOf('\\_')) {
                        processLessFile(data, filepath);
                     }
                  });
               }
               cb();
            },
            function() {
               if (!foundFile) {
                  grunt.log.ok('Файл не найден!');
               }
               grunt.log.ok(
                  `${humanize.date('H:i:s')} : Задача less1by1 выполнена.`
               );
               errors.forEach(err => {
                  grunt.log.error(err);
               });
               errors = [];
               taskDone();
            }
         );
      }
   );
};
