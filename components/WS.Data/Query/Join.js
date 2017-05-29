/* global define */
define('js!WS.Data/Query/Join', [
   'Core/core-extend',
   'js!WS.Data/Entity/OptionsMixin'
], function (
   CoreExtend,
   OptionsMixin
) {
   'use strict';

   /**
    * Объект, задающий способ объединения множеств.
    * @class WS.Data/Query/Join
    * @mixes WS.Data/Entity/OptionsMixin
    * @public
    * @author Мальцев Алексей
    */

   var Join = CoreExtend.extend([OptionsMixin], /** @lends WS.Data/Query/Join.prototype */{
      _moduleName: 'WS.Data/Query/Join',

      /**
       * @cfg {String} Правое множество
       * @name WS.Data/Query/Join#resource
       */
      _$resource: '',

      /**
       * @cfg {String} Синоним правого множества
       * @name WS.Data/Query/Join#as
       */
      _$as: '',

      /**
       * @cfg {Object} Правило объединения
       * @name WS.Data/Query/Join#on
       */
      _$on: {},

      /**
       * @cfg {Object} Выбираемые поля
       * @name WS.Data/Query/Join#select
       */
      _$select: {},

      /**
       * @cfg {Boolean} Внутреннее объединение
       * @name WS.Data/Query/Join#inner
       */
      _$inner: true,

      constructor: function $Join(options) {
         Join.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      },

      /**
       * Возвращает правое множество
       * @return {String}
       */
      getResource: function () {
         return this._$resource;
      },

      /**
       * Возвращает синоним правого множества
       * @return {String}
       */
      getAs: function () {
         return this._$as;
      },

      /**
       * Возвращает правило объеднения
       * @return {Object}
       */
      getOn: function () {
         return this._$on;
      },

      /**
       * Возвращает правило объеднения
       * @return {Object}
       */
      getSelect: function () {
         return this._$select;
      },

      /**
       * Это внутреннее объединение
       * @return {Boolean}
       */
      isInner: function () {
         return this._$inner;
      }
   });

   return Join;
});
