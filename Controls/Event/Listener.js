/**
 * Created by dv.zuev on 17.01.2018.
 * Компонент слушает события "снизу". События register и сохраняет Emmitterы в списке
 * то есть, кто-то снизу сможет услышать события верхних компонентов через это отношение
 */
define('Controls/Event/Listener',
   [
      'Core/Control',
      'tmpl!Controls/Event/Listener',
      'WS.Data/Type/descriptor',
      'tmpl!Controls/Application/CompatibleScripts'
   ],
   function(Control, template, types) {

      'use strict';

      var EventCatcher = Control.extend({
         _template: template,
         _listner: null,
         _beforeMount: function(){
            this._listner = {};
            this._registrar = new Registrar({register: this._options.register});
         },
         _registerIt: function(event, registerType, component, callback){
            this._registrar.register(event, registerType, component, callback);
         },
         _unRegisterIt: function(event, registerType, component){
            this._registrar.unregister(event, registerType, component, callback);
         },
         start: function(){
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
