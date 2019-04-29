define('Controls-demo/Input/Area/BubblingEvents',
   [
      'Core/Control',
      'wml!Controls-demo/Input/Area/BubblingEvents',

      'css!Controls-demo/Input/Area/BubblingEvents'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _events: null,
         _template: template,

         _beforeMount: function() {
            this._events = {
               keyDown: false,
               keyPress: false,
               keyUp: false
            };
         },

         _keyDownHandler: function() {
            this._events.keyDown = true;
         },

         _keyPressHandler: function() {
            this._events.keyPress = true;
         },

         _keyUpHandler: function() {
            this._events.keyUp = true;
         },

         clear: function() {
            this._events.keyDown = false;
            this._events.keyPress = false;
            this._events.keyUp = false;
         },

         getEvents: function() {
            return this._events;
         }
      });
   });
