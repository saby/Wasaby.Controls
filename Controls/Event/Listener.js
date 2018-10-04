/**
 * Created by dv.zuev on 17.01.2018.
 *
 * Вставляем в tmpl:
 * <Controls.Event.Listener event="scroll" callback="myScrollCallback()" />
 */
define('Controls/Event/Listener',
   [
      'Core/Control',
      'wml!Controls/Event/Listener',
      'WS.Data/Type/descriptor'
   ],
   function(Control, template, types) {

      'use strict';

      var EventListener = Control.extend({
         _template: template,
         _afterMount: function() {
            this._notify('register', [this._options.event, this, this.callback], {bubbling: true});
         },
         _beforeUnmount: function() {
            this._notify('unregister', [this._options.event, this], {bubbling: true});
         },
         callback: function() {
            this._notify(this._options.event, Array.prototype.slice.call(arguments));
         }
      });

      EventListener.getOptionTypes = function() {
         return {
            event: types(String).required()
         };
      };

      return EventListener;
   }
);
