var fs = require('fs');
var path = require('path');

var themesDir = path.join(__dirname, 'themes');

// порядок сборки стилей контролов
var order = {
   demo: ['Button', 'ToggleButton', 'RadioButton', 'SwitcherDoubleOnline', 'Switcher', 'TextBox', 'PasswordTextBox', 'NumberTextBox', 'TabButton', 'CheckBox', 'ColorPicker', 'ComboBox'],
   presto: ['Button', 'TextBox'],
   online: ['Button', 'ToggleButton', 'RadioButton', 'SwitcherDoubleOnline', 'Switcher', 'TextBox', 'PasswordTextBox', 'NumberTextBox', 'CheckBox'],
   genie: ['Button', 'RadioButton', 'TextBox', 'CheckBox', 'ComboBox']
};

var dirWalker = function (dir) {
   var files = fs.readdirSync(dir);
   var countThemes = files.length;
   for (var i = 0; i < countThemes; i++) {
      var folderPath = path.join(themesDir, files[i]);
      if (fs.statSync(folderPath).isDirectory()) {
         // папка стилей темы
         fs.writeFile(path.join(folderPath, files[i] + '.css'), '');
         var data = '';
         for (var j = 0; j < order[files[i]].length; j++) {
            var controlCss = path.join(folderPath, order[files[i]][j]) + '.css';
            data += '/* ' + order[files[i]][j] + ' */' + '\n\n';
            data += fs.readFileSync(controlCss) + '\n\n';
         }
         fs.appendFile(path.join(folderPath, files[i] + '.css'), data, function (err) {
            if (err) console.log(err);
            console.log('It\'s saved!');
         });
      }
   }
};

dirWalker(themesDir);