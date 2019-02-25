/**
 * Created by dv.zuev on 02.02.2018.
 */
define('Controls/Application/Compatible', [
   'Core/Control',
   'Env/Event',
   'Core/Deferred',
   'Env/Env',
   'Controls/Popup/Compatible/Layer',
   'wml!Controls/Application/Compatible',
   'wml!Controls/Application/CompatibleScripts'
], function(Base,
   EnvEvent,
   Deferred,
   Env,
   Layer,
   template) {
   'use strict';

   var ViewTemplate = Base.extend({
      _template: template,
      _wasPatched: false,
      _beforeMount: function() {
         try {
            /*TODO: set to presentation service*/
            process.domain.req.compatible = true;
         } catch (e) {
         }
         var rightsInitialized = new Deferred();
         this._forceUpdate = function() {
            return;
         };
         if (typeof window !== 'undefined') {
            Env.constants.rights = true;
            Layer.load(undefined, true).addCallback(function() {
               rightsInitialized.callback();
            });
            return rightsInitialized;
         }
      },
      _afterMount: function() {
         for (var i in this._children) {
            this._children[i]._forceUpdate = function() {
               return;
            };
            this._children[i]._shouldUpdate = function() {
               return false;
            };
         }
         require(['Lib/StickyHeader/StickyHeaderMediator/StickyHeaderMediator'], function() {
            EnvEvent.Bus.globalChannel().notify('bootupReady', {error: ''});
         });
      },
      _shouldUpdate: function() {
         return false;
      }
   });

   return ViewTemplate;
});
