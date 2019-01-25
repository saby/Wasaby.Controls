define('Controls-demo/SerializerDepsStorage/SerializerDepsStorage', [
   'Core/Control',
   'wml!Controls-demo/SerializerDepsStorage/SerializerDepsStorage'
], function(
   Control,
   template
) {
   'use strict';

   var DemoControl = Control.extend({
      _template: template,
      result: 'не проверено',
      _beforeMount: function(opt, ctx, rs) {
         var self = this;
         return new Promise(function(resolve) {
            if (typeof document === 'undefined') {
               // Выполним на сервере асинхронный require модуля, генерирующего объект, который содержит функцию.
               require(['Controls-demo/SerializerDepsStorage/ModuleToRequire'], function(result) {
                  resolve({ opt: result.myFunc });
               });
            } else {
               // На клиенте функция из модуля, полученного на сервере, должна прийти в третьем аргументе.
               // В зависимости от того, выполнено это условие или нет, в шаблоне отрисуется "верно" или "неверно".
               self.result = typeof rs.opt === 'function' && rs.opt() === 'function result' ? 'верно' : 'неверно';
               resolve();
            }
         });
      }
   });

   return DemoControl;
});
