/* global define */
define('js!WS.Data/Entity/VersionableMixin', [
], function (
) {
   'use strict';

   /**
    * Миксин, позволяющий клонировать объекты.
    * @mixin WS.Data/Entity/VersionableMixin
    * @public
    * @author Мальцев Алексей
    */

   var VersionableMixin = /**@lends WS.Data/Entity/VersionableMixin.prototype  */{
      //region WS.Data/Entity/IVersionable
      _version: 0,

      getVersion: function() {
         return this._version;
      },

      _nextVersion: function() {
         this._version++;
         if (this._wsDataEntityOneToManyMixin) {//it's equal to CoreInstance.instanceOfMixin(this, 'WS.Data/Entity/OneToManyMixin')
            var parent = this._getMediator().getParent(this);
            if (parent && parent._wsDataEntityIVersionable) {//it's equal to CoreInstance.instanceOfMixin(this, 'WS.Data/Entity/IVersionable')
               parent._nextVersion();
            }
         }
      }

      //endregion WS.Data/Entity/IVersionable
   };

   return VersionableMixin;
});
