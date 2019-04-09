import Control from 'Core/Control';
import Deferred from 'Core/Deferred';
import template from 'wml!Controls/_popup/Previewer/OpenerTemplate';
import Utils from 'View/Executor/Utils';
import 'Controls/Container/Async';
      

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

      export default OpenerTemplate;
   

