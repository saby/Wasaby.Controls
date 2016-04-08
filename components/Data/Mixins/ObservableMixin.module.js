/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.ObservableMixin', function () {
   'use strict';

   /**
    * Дает возможность использовать события
    * @class SBIS3.CONTROLS.Data.ObservableMixin
    * @public
    * @author Мальцев Алексей
    */

   var ObservableMixin = /**@lends SBIS3.CONTROLS.Data.ObservableMixin.prototype */{
      subscribe: function () {
      },

      unsubscribe: function () {
      },

      _notify: function () {
      }
   };

   return ObservableMixin;
});
