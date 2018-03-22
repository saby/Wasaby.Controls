/**
 * Created by dv.zuev on 02.02.2018.
 */
define('Controls/Application/Compatible', [
   'Core/Control',
   'Core/EventBus',
   'tmpl!Controls/Application/Compatible',
   'tmpl!Controls/Application/CompatibleScripts'
], function(Base,
            EventBus,
            template) {
   'use strict';

   var ViewTemplate = Base.extend({
      _template: template,
      _wasPatched: false,
      _beforeMount: function(){
         this._forceUpdate = function(){
            return;
         }
      },
      _afterMount: function(){
         for (var i in this._children){
            this._children[i]._forceUpdate = function(){
               return;
            };
            this._children[i]._shouldUpdate = function(){
               return false;
            }
         }
         EventBus.globalChannel().notify('bootupReady', {error:''});
      },
      _shouldUpdate: function(){
         return false;
      }
   });

   return ViewTemplate;
});