'use strict';
const helpers = require('./helpers'),
   fs = require('fs'),
   ProgressBar = require('progress'),
   path = require('path'),
   humanize = require('humanize'),
   less = require('less'),
   postcss = require('postcss'),
   autoprefixer = require('autoprefixer'),
   getModuleNameRegExp = new RegExp('\/resources\/([^/]+)'),
   DEFAULT_THEME = 'online';
let errors = [];

/**
 @workaround Временно ресолвим текущую тему по названию модуля.
*/
function resolveThemeName(filepath) {

   let regexpMathch = filepath.match(getModuleNameRegExp, ''),
      s3modName = regexpMathch ? regexpMathch[1] : 'smth';

   switch (s3modName) {
      case 'Upravlenie_oblakom':
         return 'cloud';
      case 'Presto':
         return 'presto';
      case 'sbis.ru':
         return 'sbisru';
      case 'Retail':
         return 'carry';
      default:
         return 'online';
   }
}

function itIsControl(path) {
   return ~path.indexOf('components') && !~path.indexOf('components\\themes');
}

module.exports = function less1by1Task(grunt) {
   let root = grunt.option('root') || '',
      app = grunt.option('application') || '',
      rootPath = path.join(root, app),
      themesPath = path.join(rootPath, './components/themes/');

   function processLessFile(data, filePath, error, theme, itIsControl) {

      let lessData = data.toString(),
         imports = theme
            ? `
            @import '${themesPath}${theme}/_variables';
            @import '${themesPath}_mixins';
            @themeName: ${theme};

            ` : '';

      less.render(imports + lessData, {
         filename: filePath,
         cleancss: false,
         relativeUrls: true,
         strictImports: true
      }, function writeCSS(compileLessError, output) {

         if (compileLessError) {
            errors.push(`\n\n ${compileLessError.message} in file: ${compileLessError.filename} on line: ${compileLessError.line}`);
         }

         let suffix = '';

         if (itIsControl) {
            suffix = (theme === DEFAULT_THEME) ? '' : `__${theme}`;
         }

         let newName = `${path.dirname(filePath)}/${path.basename(filePath, '.less')}${suffix}.css`;

         if (output) {
            const postcssOptions = {
               from: null //глушу warning postcss про генерацию source map. Все равно локально они нам не нужны
            };
            postcss([autoprefixer({ browsers: ['last 2 versions', 'ie>=10'] })]).process(output.css, postcssOptions).then(postcssOutput => {
               fs.writeFile(newName, postcssOutput.css, function writeFileCb(writeFileError) {
                  if (writeFileError) {
                     errors.push(`\n\n Не могу записать файл. Ошибка: ${writeFileError.message}.`);
                  }
               });
            });
         }
      });
   }

   grunt.registerMultiTask('less1by1', 'Компилит каждую лесску, ложит cssку рядом. Умеет в темы', function() {

      let lessName = grunt.option('name') || '*',
         foundFile = false;

      grunt.log.ok(`\n\n ${humanize.date('H:i:s')} : Запускается задача less1by1.`);

      if (lessName !== '*') {
         grunt.log.ok(`Ищем файл: ${lessName}.less`);
      }
      let taskDone = this.async();
      var bar = new ProgressBar('  compiling [:bar] :file', {
         complete: '♥',
         incomplete: '_',
         width: 30,
         total: 156
      });
      helpers.recurse(rootPath, function(filepath, cb) {
         let relpath = path.relative(rootPath, filepath);
         if (helpers.validateFile(relpath, [grunt.config.get('changed') || `components/**/${lessName}.less`]) ||
              helpers.validateFile(relpath, [grunt.config.get('changed') || `components/themes/**/${lessName}.less`]) ||
               helpers.validateFile(relpath, [grunt.config.get('changed') || `demo/**/${lessName}.less`]) ||
               helpers.validateFile(relpath, [grunt.config.get('changed') || `pages/**/${lessName}.less`]) ||
               helpers.validateFile(relpath, [grunt.config.get('changed') || `Controls-demo/**/${lessName}.less`]) ||
               helpers.validateFile(relpath, [grunt.config.get('changed') || `Controls/**/${lessName}.less`])) {
            foundFile = true;
            fs.readFile(filepath, function readFileCb(readFileError, data) {

               if (itIsControl(filepath)) {
                  bar.tick(1, {

                     'file': filepath
                  });

                  processLessFile(data, filepath, readFileError, DEFAULT_THEME, true);
               } else {
                  //todo: black_list
                  if (!~filepath.indexOf('_theme.less') &&
                           !~filepath.indexOf('_header.less') &&
                           !~filepath.indexOf('_mixins.less') &&
                           !~filepath.indexOf('_typograpy.less') &&
                           !~filepath.indexOf('general.less') &&
                           !~filepath.indexOf('_flex.less') &&
                           !~filepath.indexOf('_defaults.less') &&
                           !~filepath.indexOf('_theme-fixme.less') &&
                           !~filepath.indexOf('_variables.less') &&
                           !~filepath.indexOf('_sizes.less') &&
                           !~filepath.indexOf('_control-list.less') &&
                           !~filepath.indexOf('_colors.less')) {
                     processLessFile(data, filepath, readFileError, DEFAULT_THEME, false);
                  }
               }
            });
         }
         cb();
      }, function() {

         if (!foundFile) {
            grunt.log.ok('Файл не найден!');
         }
         grunt.log.ok(`${humanize.date('H:i:s')} : Задача less1by1 выполнена.`);
         errors.forEach((err) => {
            grunt.log.error(err);
         });
         errors = [];
         taskDone();
      });
   });
};
