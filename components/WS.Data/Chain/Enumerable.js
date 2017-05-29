/* global define, require */
define('js!WS.Data/Chain/Enumerable', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Di',
   'Core/core-instance'
], function (
   Abstract,
   Di,
   CoreInstance
) {
   'use strict';

   /**
    * Цепочка по IEnumerable.
    * @class WS.Data/Chain/Enumerable
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var EnumerableChain = Abstract.extend(/** @lends WS.Data/Chain/Enumerable.prototype */{
      _moduleName: 'WS.Data/Chain/Enumerable',

      constructor: function $Enumerable(source) {
         if (!CoreInstance.instanceOfMixin(source, 'WS.Data/Collection/IEnumerable')) {
            throw new TypeError('Source must implement WS.Data/Collection/IEnumerable');
         }
         EnumerableChain.superclass.constructor.call(this, source);
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return this._source.getEnumerator();
      },

      each: function (callback, context) {
         return this._source.each(callback, context);
      },

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Chain/Abstract

      toObject: function () {
         if (CoreInstance.instanceOfMixin(this._source, 'WS.Data/Entity/IObject')) {
            var result = {};
            this.each(function(key, value) {
               result[key] = value;
            });
            return result;
         }
         return EnumerableChain.superclass.toObject.call(this);
      }

      //endregion WS.Data/Chain/Abstract
   });

   return EnumerableChain;
});
