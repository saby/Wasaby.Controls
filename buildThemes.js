var fs = require('fs');
var path = require('path');

var themesDir = path.join(__dirname, 'themes');

// порядок сборки стилей контролов
var order = {
   demo: ['Button', 'ToggleButton', 'RadioButton', 'SwitcherDoubleOnline', 'Switcher', 'TextBox', 'PasswordTextBox', 'NumberTextBox', 'TabButton', 'CheckBox', 'ColorPicker', 'ComboBox'],
   online: ['Button', 'ToggleButton', 'RadioButton', 'SwitcherDoubleOnline', 'Switcher', 'TextBox', 'PasswordTextBox', 'NumberTextBox', 'CheckBox']
};

var dirWalker = function (dir) {
   var files = fs.readdirSync(dir);
   var countThemes = files.length;
   for (var i = 0; i < countThemes; i++) {
      var folderPath = path.join(themesDir, files[i]);
      if (fs.statSync(folderPath).isDirectory()) {
         // папка стилей темы
         var cssPath = path.join(folderPath, 'css');
         fs.writeFile(path.join(folderPath, 'result', files[i] + '.css'), '');
         for (var j = 0; j < order[files[i]].length; j++) {
            var controlCss = path.join(cssPath, order[files[i]][j]) + '.css';
            var data = fs.readFileSync(controlCss);
            fs.appendFile(path.join(folderPath, 'result', files[i] + '.css'), '/* ' + order[files[i]][j] + ' */' + '\n\n');
            fs.appendFile(path.join(folderPath, 'result', files[i] + '.css'), data + '\n\n', function (err) {
               if (err) console.log(err);
               console.log('It\'s saved!');
            });
         }
      }
   }
};

dirWalker(themesDir);