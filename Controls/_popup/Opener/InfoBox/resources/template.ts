import Control = require('Core/Control');
import template = require('wml!Controls/_popup/Opener/InfoBox/resources/template');
import Utils = require('View/Executor/Utils');
import Deferred = require('Core/Deferred');
      

      export = Control.extend({
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

         _close: function() {
            // todo For Compatible. Remove after https://online.sbis.ru/opendoc.html?guid=dedf534a-3498-4b93-b09c-0f36f7c91ab5
            this._notify('sendResult', [{ type: 'close' }], { bubbling: true });
            this._notify('close');
         },
         _sendResult: function(event) {
            this._notify('sendResult', [event], { bubbling: true });
         }
      });
   
