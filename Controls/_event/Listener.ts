/**
 * Created by dv.zuev on 17.01.2018.
 *
 * Вставляем в tmpl:
 * <Controls/event:Listener event="scroll" callback="myScrollCallback()" />
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_event/Listener');
import entity = require('Types/entity');



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
      event: entity.descriptor(String).required()
   };
};

export = EventListener;

