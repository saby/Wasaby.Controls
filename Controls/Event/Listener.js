/**
 * Created by dv.zuev on 17.01.2018.
 * Компонент слушает события "снизу". События register и сохраняет Emmitterы в списке
 * то есть, кто-то снизу сможет услышать события верхних компонентов через это отношение
 */
define('Controls/Event/Listener',
   [
      'Core/Control',
      'tmpl!Controls/Event/Listener',
      'js!WS.Data/Type/descriptor',
	  'tmpl!Controls/Application/CompatibleScripts'
   ],
   function(Control, template, types) {

      'use strict';

      var EventCatcher = Control.extend({
         _template: template,
         _listner: null,
         _beforeMount: function(){
            this._listner = {};
         },
         _registerIt: function(event, registerType, component, callback){
            if (registerType === this._options.register) {
               this._listner[component.getInstanceId()] = {
                  component: component,
                  callback: callback
               };
               event.stopPropagation();
            }
         },
         _unRegisterIt: function(event, registerType, component){
            if (registerType === this._options.register) {
               this._listner[component.getInstanceId()] = null;
               event.stopPropagation();
            }
         },
         start: function(){
            if (!this._listner)
               return;
            for(var i in this._listner){
               var obj = this._listner[i];
               obj && obj.callback.apply(obj.component, arguments);
            }
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
