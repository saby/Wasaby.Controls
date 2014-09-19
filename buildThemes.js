var fs = require('fs');
var path = require('path');

var themesDir = path.join(__dirname, 'themes');

// порядок сборки стилей контролов
var order = ['Button', 'ToggleButton', 'SwitcherDoubleOnline', 'Switcher', 'TextBox', 'PasswordTextBox', 'NumberTextBox'];

var dirWalker = function (dir) {
   var files = fs.readdirSync(dir);
   var countThemes = files.length;
   for (var i = 0; i < countThemes; i++) {
      var folderPath = path.join(themesDir, files[i]);
      if (fs.statSync(folderPath).isDirectory()) {
         // папка стилей темы
         var cssPath = path.join(folderPath, 'css');
         fs.writeFile(path.join(folderPath, 'result', files[i] + '.css'), '');
         for (var j = 0; j < order.length; j++) {
            var controlCss = path.join(cssPath, order[j]) + '.css';
            var data = fs.readFileSync(controlCss);
            fs.appendFile(path.join(folderPath, 'result', files[i] + '.css'), '/* ' + order[j] + ' */' + '\n\n');
            fs.appendFile(path.join(folderPath, 'result', files[i] + '.css'), data + '\n\n', function (err) {
               if (err) console.log(err);
               console.log('It\'s saved!');
            });
         }
      }
   }
};

dirWalker(themesDir);