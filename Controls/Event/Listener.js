/**
 * Created by dv.zuev on 17.01.2018.
 * Компонент слушает события "снизу". События register и сохраняет Emmitterы в списке
 * то есть, кто-то снизу сможет услышать события верхних компонентов через это отношение
 */
define('Controls/Event/Listener',
   [
      'Core/Control',
      'tmpl!Controls/Event/Listener',
      'Controls/Event/Registrar',
      'WS.Data/Type/descriptor',
      'wml!Controls/Application/CompatibleScripts'
   ],
   function(Control, template, Registrar, types) {

      'use strict';

      var EventCatcher = Control.extend({
         _template: template,
         _listner: null,
         constructor: function() {
            EventCatcher.superclass.constructor.apply(this, arguments);
            this._forceUpdate = function() {
               // Do nothing
               // This method will be called because of handling event.
            };
         },
         _beforeMount: function(newOptions) {
            this._registrar = new Registrar({register: newOptions.register});
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
         }
      });

      EventCatcher.getOptionTypes = function() {
         return {
            register: types(String).required()
         };
      };

      return EventCatcher;
   }
);
