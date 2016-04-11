/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Entity.Options', [
   'js!SBIS3.CONTROLS.Data.Core',
   'js!SBIS3.CONTROLS.Data.Di'
], function (Core, Di) {
   'use strict';

   /**
    * Cущность, свойства которой передаются в конструктор в виде опций (объекта ключ - значение)
    * @class SBIS3.CONTROLS.Data.Entity.Options
    * @public
    * @author Мальцев Алексей
    */

   var Options = Core.extend(/** @lends SBIS3.CONTROLS.Entity.Options.prototype */{
      constructor: function $Options (cfg){
         if (cfg instanceof Object) {
            var option, property;
            for (option in cfg) {
               if (cfg.hasOwnProperty(option) &&
                  (property = '$' + option) in this
               ) {
                  this[property] = cfg[option];
               }
            }
         }
      },

      _getOptions: function() {
         var options = {};
         for (var key in this) {
            if (key[0] === '$') {
               options[key.substr(1)] = this[key];
            }
         }
         return options;
      }
   });

   Di.register('entity.options', Options);

   return Options;
});
