/* global define */
define('Controls/Date/Mixin/EventProxy', [
], function(
) {
   'use strict';

   /**
    * An mixin that allows the component to proxy events from models and internal controls.
    * @class Controls.Date.Mixin.EventProxy
    * @public
    * @author Миронов А.Ю.
    */

   var Mixin = {

      /**
       * Проксирует событие из компонента
       * @protected
       */
      _proxyEvent: function(event) {
         this._notify(event.type, Array.prototype.slice.call(arguments, 1));
      }
   };

   return Mixin;
});
