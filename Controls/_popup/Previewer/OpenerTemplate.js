define('Controls/Popup/Previewer/OpenerTemplate',
   [
      'Core/Control',
      'Core/Deferred',
      'wml!Controls/Popup/Previewer/OpenerTemplate',
      'View/Executor/Utils',
      'Controls/Container/Async'
   ],
   function(Control, Deferred, template, Utils) {
      'use strict';

      var OpenerTemplate = Control.extend({
         _template: template,

         _beforeMount: function(options) {
            if (typeof window !== 'undefined' && this._needRequireModule(options.template)) {
               var def = new Deferred();
               require([options.template], def.callback.bind(def), def.callback.bind(def));
               return def;
            }
         },

         _needRequireModule: function(module) {
            return typeof module === 'string' && !Utils.RequireHelper.defined(module);
         },

         _sendResult: function(event) {
            this._notify('sendResult', [event], { bubbling: true });
         }
      });

      return OpenerTemplate;
   });
