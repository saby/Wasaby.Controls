/* global define */
define('/Display/Breadcrumbs', [
   'WS.Data/Entity/IObject',
   'Core/core-extend'
], function (
   IObject,
   extend
) {
   'use strict';

   /**
    * Хлебная крошка - обертка над массивом.
    * @class /Display/Breadcrumbs
    * @extends Array
    * @author Мальцев Алексей
    */

   var Breadcrumbs = extend(Array, [IObject], {
      _moduleName: '/Display/Breadcrumbs',

      constructor: function Breadcrumbs() {
         Breadcrumbs.superclass.constructor.apply(this, arguments);
      },

      //region Public

      /**
       * Возвращает  последний элемент хлебной крошки.
       */
      get last() {
         return this[this.length - 1];
      },

      /**
       * Финализирует хлебную крошку - устанавливает ее свойствами свойства последнего элемента.
       */
      finalize: function() {
         var last = this.last;
         if (last instanceof Object) {
            Object.getOwnPropertyNames(last).forEach(function(property) {
               Object.defineProperty(this, property, Object.getOwnPropertyDescriptor(last, property));
            }, this);
         }
      },

      //endregion Public

      //region WS.Data/Entity/IObject

      get: function (name) {
         return this.last && this.last.get && this.last.get(name);
      },

      set: function () {
         throw new Error('Object wrapper is read only');
      },

      has: function (name) {
         return this.last && this.last.has ? this.last.has(name) : false;
      }

      //endregion WS.Data/Entity/IObject
   });

   return Breadcrumbs;
});
