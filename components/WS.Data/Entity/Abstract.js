/* global define */
define('js!WS.Data/Entity/Abstract', [
   'js!WS.Data/Di',
   'Core/core-extend'
], function (
   Di,
   CoreExtend
) {
   'use strict';

   /**
    * Абстрактная сущность.
    * Это абстрактный класс, не предназначенный для создания самостоятельных экземпляров.
    * Явлется прототипом большинства сущностей.
    * Обладает аспектом состояния "экземпляр разрушен".
    * @class WS.Data/Entity/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var Abstract = CoreExtend.extend(/** @lends WS.Data/Entity/Abstract.prototype */{
      _moduleName: 'WS.Data/Entity/Abstract',

      /**
       * @member {Boolean} Экземпляр был разрушен
       */
      _destroyed: false,

      /**
       * Разрушает экземпляр
       */
      destroy: function() {
         this._destroyed = true;
      },

      /**
       * Возвращает признак, что экземпляр разрушен
       * @return {Boolean}
       */
      isDestroyed: function() {
         return this._destroyed;
      }
   });

   Di.register('entity.abstract', Abstract);

   return Abstract;
});
