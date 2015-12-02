/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.HashableMixin', [
], function () {
   'use strict';

   /**
    * Миксин, позволяющий генерировать уникальный (в рамках миксина) хеш для экземпляра класса
    * @mixin SBIS3.CONTROLS.Data.HashableMixin
    * @implements SBIS3.CONTROLS.Data.IHashable
    * @public
    * @author Мальцев Алексей
    */

   var HashableMixin = /**@lends SBIS3.CONTROLS.Data.HashableMixin.prototype  */{
      $protected: {
         /**
          * @var {String} Префикс значений хеша
          */
         _hashPrefix: 'id-',

         /**
          * @var {String} Уникальный хеш
          */
         _hash: ''
       },

      //region SBIS3.CONTROLS.Data.IHashable

      getHash: function () {
         return this._hash || (this._hash = this._hashPrefix + _hashCounter++);
      }

      //endregion SBIS3.CONTROLS.Data.IHashable
   };

   var _hashCounter = 0;

   return HashableMixin;
});
