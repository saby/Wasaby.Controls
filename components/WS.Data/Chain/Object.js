/* global define, require */
define('js!WS.Data/Chain/Object', [
   'js!WS.Data/Chain/Abstract',
   'js!WS.Data/Collection/ObjectEnumerator',
   'js!WS.Data/Di'
], function (
   Abstract,
   ObjectEnumerator,
   Di
) {
   'use strict';

   /**
    * Цепочка по объекту.
    * @class WS.Data/Chain/Object
    * @extends WS.Data/Chain/Abstract
    * @public
    * @author Мальцев Алексей
    */

   var ObjectChain = Abstract.extend(/** @lends WS.Data/Chain/Object.prototype */{
      _moduleName: 'WS.Data/Chain/Object',

      constructor: function $Object(source) {
         ObjectChain.superclass.constructor.call(this, source);
      },

      //region WS.Data/Collection/IEnumerable

      getEnumerator: function () {
         return new ObjectEnumerator(this._source);
      },

      each: function (callback, context) {
         var keys = Object.keys(this._source),
            count = keys.length,
            key,
            i;

         for (i = 0; i < count; i++) {
            key = keys[i];
            callback.call(
               context || this,
               this._source[key],
               key
            );
         }
      },

      value: function (factory) {
         if (factory instanceof Function) {
            return ObjectChain.superclass.value.call(this, factory);
         }

         return this.toObject();
      }

      //endregion WS.Data/Collection/IEnumerable
   });

   Di.register('chain.$object', ObjectChain, {instantiate: false});
   Di.register('chain.object', ObjectChain);

   return ObjectChain;
});
