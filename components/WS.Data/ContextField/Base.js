/* global define */
define('js!WS.Data/ContextField/Base', [
   'Core/core-extend'
], function (
   CoreExtend
) {
   'use strict';
   /**
    * Базовый класс для поддержки типов в контексте
    * @class WS.Data/ContextField/Base
    * @author Мальцев Алексей
    */
   var Base = CoreExtend.extend(/** @lends WS.Data/ContextField/Base.prototype*/{
      _moduleName: 'WS.Data/ContextField/Base',

      /**
       * @member {Function} Модуль, который поддерживает контекст
       */
      _module: null,

      /**
       * Конструктор
       * @param {Function} module Конструктор типа, поддерживаемого контекстом
       */
      constructor: function $Base(module) {
         if (typeof module !== 'function') {
            throw new ReferenceError('Argument "module" must be a function.');
         }
         this._module = module;
      },

      /**
       * Подтверждает, что данный тип значения обрабатывается этим модулем
       * @param {Object} value Значение в контексте
       * @return {Boolean}
       */
      is: function (value) {
         return value instanceof this._module;
      },

      /**
       * Конвертирует значение в контексте в JSON
       * @param {Object} value Значение в контексте
       * @param {Boolean} deep Включая вложенные значения
       * @return {Object}
       */
      toJSON: function (value, deep) {
         if (!deep || !value || !value.each) {
            return value;
         }
         var result = {};
         value.each(function(key, value) {
            result[key] = value;
         });
         return result;
      }
   });

   return Base;
});