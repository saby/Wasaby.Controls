define('Controls/DragNDrop/Container/Compound',
   [
      'Core/Control',
      'wml!Controls/DragNDrop/Container/Compound/Compound',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],

   function(Control, template, SyntheticEvent) {
      return Control.extend({
         _template: template,

         _onRegisterHandler: function(event, eventName, emitter, handler) {
            if (['mousemove', 'touchmove', 'mouseup', 'touchend'].indexOf(eventName) !== -1) {
               if (handler) {
                  this._compoundHandlers = this._compoundHandlers || {};
                  this._compoundHandlers[eventName] = function(event) {
                     handler.apply(emitter, [new SyntheticEvent(event)]);
                  };
                  document.body.addEventListener(eventName, this._compoundHandlers[eventName]);
               } else if (this._compoundHandlers && this._compoundHandlers[eventName]) {
                  document.body.removeEventListener(eventName, this._compoundHandlers[eventName]);
                  this._compoundHandlers[eventName] = null;
               }
            }
         }
      });
   });
