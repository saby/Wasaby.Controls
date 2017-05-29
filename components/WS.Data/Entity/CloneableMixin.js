/* global define */
define('js!WS.Data/Entity/CloneableMixin', [
   'Core/Serializer'
], function (
   Serializer
) {
   'use strict';

   /**
    * Миксин, позволяющий клонировать объекты.
    * Для корректной работы требуется подмешать {@link WS.Data/Entity/SerializableMixin}.
    * @mixin WS.Data/Entity/CloneableMixin
    * @public
    * @author Мальцев Алексей
    */

   var CloneableMixin = /**@lends WS.Data/Entity/CloneableMixin.prototype  */{
      //region WS.Data/Entity/ICloneable

      clone: function(shallow) {
         var clone;

         if (shallow) {
            var proto = Object.getPrototypeOf(this),
               Module = proto.constructor,
               data = this.toJSON();

            data.state = this._unlinkCollection(data.state);

            clone = Module.prototype.fromJSON.call(Module, data);
         } else {
            var serializer = new Serializer();
            serializer.setDetectContainers(false);
            clone = JSON.parse(
               JSON.stringify(this, serializer.serialize),
               serializer.deserialize
            );
         }

         //TODO: раскидать по конечным модулям, которые подмещивают InstantiableMixin
         delete clone._instanceId;

         return clone;
      },

      //endregion WS.Data/Entity/ICloneable

      //region Protected methods

      _unlinkCollection: function(collection) {
         var result;

         if (collection instanceof Array) {
            result = [];
            for (var i = 0; i < collection.length; i++) {
               result[i] = this._unlinkObject(collection[i]);
            }
            return result;
         } else if (collection instanceof Object) {
            result = {};
            for (var key in collection) {
               if (collection.hasOwnProperty(key)) {
                  result[key] = this._unlinkObject(collection[key]);
               }
            }
            return result;
         }

         return collection;
      },

      _unlinkObject: function(object) {
         if (object instanceof Array) {
            return object.slice();
         }
         return object;
      }

      //endregion Protected methods
   };

   return CloneableMixin;
});
