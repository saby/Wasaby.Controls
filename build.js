/**
 * Собирает файлы contents.json и contents.js
 */

var fs = require('fs'),
   path = require('path'),
   baseDir = process.cwd(),
   baseResources = path.join(baseDir, 'components'),//а может быть SBIS3.CONTROLS
   testResources = path.join(baseDir, 'tests/unit'),
   getModules = (function() {
      var modules = {},
         modulePattern = /\.module\.js$/,
         currentItem = '';
      
      //Dirty hack
      global.define = function(name) {
         modules[name.replace(/^js!/, '')] = '/' + path.relative(baseDir, currentItem).replace(/\\/g, '/');
      };

      return function (dir) {
         fs.readdirSync(dir).forEach(function (file) {
            currentItem = path.join(dir, file);
            if (fs.statSync(currentItem).isDirectory()) {
               getModules(currentItem);
            } else {
               if (modulePattern.test(file)) {
                  require(currentItem);
               }
            }
         });

         return modules;
      };
   })();

var modules = getModules(baseResources),
   testModules = getModules(testResources);
for (var key in testModules) {
   if (testModules.hasOwnProperty(key)) {
      modules[key] = testModules[key];
   }
}

[{
   key: 'jsModules',
   name: path.join(baseDir, 'contents.json')
}, {
   key: 'jsModules',
   name: path.join(baseDir, 'contents.js'),
   prefix: 'contents = ',
   suffix: ';'
}].forEach(function(file) {
   var item = {};
   item[file.key] = modules;

   fs.writeFileSync(
      file.name,
      (file.prefix || '') +
      JSON.stringify(item, null, 3) +
      (file.suffix || '')
   );
   console.log('File "' + file.name + '" created successfully.');
});
