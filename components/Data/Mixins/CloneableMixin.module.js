/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.CloneableMixin', [
   'js!SBIS3.CONTROLS.Data.Serializer'
], function (Serializer) {
   'use strict';

   /**
    * Миксин, позволяющий клонировать объекты.
    * Для корректной работы требуется подмещать {@link SBIS3.CONTROLS.Data.SerializableMixin}.
    * @mixin SBIS3.CONTROLS.Data.CloneableMixin
    * @implements SBIS3.CONTROLS.Data.ICloneable
    * @public
    * @author Мальцев Алексей
    */

   var CloneableMixin = /**@lends SBIS3.CONTROLS.Data.CloneableMixin.prototype  */{
      //region SBIS3.CONTROLS.Data.ICloneable

      clone: function() {
         var serializer = new Serializer();
         return JSON.parse(
            JSON.stringify(this, serializer.serialize),
            serializer.deserialize
         );
      }

      //endregion SBIS3.CONTROLS.Data.ICloneable
   };

   return CloneableMixin;
});
