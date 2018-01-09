/**
 * Created by dv.zuev on 08.01.2018.
 */
/** Подготовим инфраструктуру для View
 * Создадим симлинк, если это необходимо.
 * Чтобы не было случайных падений - обернем в try,
 * поскольку папка уже может быть создана
 */

exports.fix = function (config) {
   try {
      if (config.viewFrom) {
         var fs = require('fs');
         fs.symlinkSync(process.cwd() + "/" + config.viewFrom, process.cwd() + "/" + config.viewTo, 'dir');
      }
   } catch (e) {
      console.log(e.message);
   }
};