/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Entity.Abstract', [
   'js!SBIS3.CONTROLS.Data.Core',
   'js!SBIS3.CONTROLS.Data.Di'
], function (Core, Di) {
   'use strict';

   /**
    * Абстрактная сущность
    * @class SBIS3.CONTROLS.Data.Entity.Abstract
    * @public
    * @author Мальцев Алексей
    */

   var Abstract = Core.extend(/** @lends SBIS3.CONTROLS.Entity.Abstract.prototype */{
      /**
       * @member {Boolean} Экземпляр был разрушен
       */
      _destroyed: false,

      /**
       * Разрушает экземпляр
       */
      destroy: function() {
         this._destroyed = true;
      }
   });

   Di.register('entity.abstract', Abstract);

   return Abstract;
});
