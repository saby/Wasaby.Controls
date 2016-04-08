/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Entity.Options', [
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Di'
], function (Utils, Di) {
   'use strict';

   /**
    * Абстрактная сущность, свойства которой передаются в конструктор в виде опций
    * @class SBIS3.CONTROLS.Data.Entity.Options
    * @public
    * @author Мальцев Алексей
    */

   var Options = function Options (cfg) /** @lends SBIS3.CONTROLS.Entity.Options.prototype */{
      if (cfg instanceof Object) {
         var option, property;
         for (var option in cfg) {
            property = '$' + option;
            if (cfg.hasOwnProperty(option) &&
               property in this
            ) {
               this[property] = cfg[option];
            }
         }
      }
   };

   Utils.extend(Options, {
      _getOptions: function() {
         var options = {};
         for (var key in this) {
            if (key[0] === '$') {
               options[key] = this[key];
            }
         }
         return options;
      }
   });

   Di.register('entity.options', Options);

   return Options;
});
