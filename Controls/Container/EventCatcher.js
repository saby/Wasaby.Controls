/**
 * Created by dv.zuev on 17.01.2018.
 */
define('js!Controls/Container/EventCatcher',
   [
      'Core/Control',
      'tmpl!Controls/Container/EventCatcher/EventCatcher',
      'js!WS.Data/Type/descriptor'
   ],
   function(Control, template, types) {

      'use strict';

      var EventCatcher = Control.extend({
         _template: template,
         _listner: null,
         _beforeMount: function(){
            this._listner = {};
         },
         _registrIt: function(event, registrType, component, callback){
            if (registrType === this._options.registr) {
               this._listner[component.getInstanceId()] = {
                  component: component,
                  callback: callback
               };
               event.stopPropagation();
            }
         },
         _unRegistrIt: function(event, registrType, component){
            if (registrType === this._options.registr) {
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
            registr: types(String).required()
         };
      };

      return EventCatcher;
   }
);
