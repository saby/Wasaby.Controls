/**
 * Created by dv.zuev on 08.01.2018.
 */
/** Подготовим инфраструктуру для View и Core
 * Создадим симлинк, если это необходимо.
 * Чтобы не было случайных падений - обернем в try,
 * поскольку папка уже может быть создана
 */

exports.fix = function (config) {
      if (config.wsModules) {
         var fs = require('fs');
         Object.keys(config.wsModules).forEach(function(name) {
            try {
               fs.symlinkSync(process.cwd() + "/" + config.wsModules[name], process.cwd() + "/" + name, 'dir');
            } catch (e) {
               console.log(e.message);
            }
         });
      }

};