/**
 * Created by dv.zuev on 17.01.2018.
 * Компонент слушает события "снизу". События register и сохраняет Listener'ы в списке
 * то есть, кто-то снизу сможет услышать события верхних компонентов через это отношение
 */
import Control = require('Core/Control');
import template = require('wml!Controls/Event/Registrator');
import Registrar = require('Controls/Event/Registrar');
import entity = require('Types/entity');
import 'wml!Controls/Application/CompatibleScripts';



var EventRegistrator = Control.extend({
   _template: template,
   _registrar: null,
   _beforeMount: function(newOptions) {
      if (typeof window !== 'undefined') {
         this._forceUpdate = function() {
            // Do nothing
            // This method will be called because of handling event.
         };
         this._registrar = new Registrar({ register: newOptions.register });
      }
   },
   _registerIt: function(event, registerType, component, callback) {
      if (registerType === this._options.register) {
         this._registrar.register(event, component, callback);
      }
   },
   _unRegisterIt: function(event, registerType, component) {
      if (registerType === this._options.register) {
         this._registrar.unregister(event, component);
      }
   },
   start: function() {
      this._registrar.start.apply(this._registrar, arguments);
   },
   _beforeUnmount: function() {
      if (this._registrar) {
         this._registrar.destroy();
         this._registrar = null;
      }
   }
});

EventRegistrator.getOptionTypes = function() {
   return {
      register: entity.descriptor(String).required()
   };
};

export = EventRegistrator;

