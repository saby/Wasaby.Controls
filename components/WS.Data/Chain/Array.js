/* global define, require */
define('js!WS.Data/Chain/Array', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Collection/ArrayEnumerator',
   'js!WS.Data/Di'
], function (
   Abstract,
   ArrayEnumerator,
   Di
) {
   'use strict';

   /**
    * Цепочка по массиву.
    * @class WS.Data/Chain/Array
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var ArrayChain = Abstract.extend(/** @lends WS.Data/Chain/Array.prototype */{
      _moduleName: 'WS.Data/Chain/Array',

      constructor: function $Array(source) {
         if (!(source instanceof Array)) {
            throw new TypeError('Source must be an instance of Array');
         }
         ArrayChain.superclass.constructor.call(this, source);
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new ArrayEnumerator(this._source);
      },

      each: function (callback, context) {
         for (var i = 0, count = this._source.length; i < count; i++) {
            callback.call(
               context || this,
               this._source[i],
               i
            );
         }
      },

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Chain/Abstract

      toArray: function () {
         return this._source.slice();
      }

      //endregion WS.Data/Chain/Abstract

   });

   Di.register('chain.$array', ArrayChain, {instantiate: false});
   Di.register('chain.array', ArrayChain);

   return ArrayChain;
});
