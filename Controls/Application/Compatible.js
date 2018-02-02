/**
 * Created by dv.zuev on 02.02.2018.
 */
define('Controls/Application/Compatible', [
   'Core/Control',
   'Core/helpers/Function/runDelayed',
   'tmpl!Controls/Application/Compatible',
   'Core/Deferred'
], function(Base, 
            runDelayed, 
            template, 
            Deferred) {
   'use strict';

   var ViewTemplate = Base.extend({
      _template: template,
      bootup: null,
      _beforeMount:function(){
         var def = new Deferred(),
            self = this;

         require(['bootup-min',
            'js!SBIS3.Engine.ServiceUpdateNotifier',
            'Core/nativeExtensions',
            'Lib/Control/BaseCompatible/BaseCompatible'], function(bootup){
            self._mounted = true;
            self.bootup = bootup;
            def.callback();
         });

         return def;
      },

      _shouldUpdate: function(){

         var self = this,
            cont = this._container[0] || this._container;
         if (self.bootup) {
            cont.removeAttribute('config');
            cont.removeAttribute('data-component');

            runDelayed(function () {
               self.bootup();
               self.bootup = null;
            });
         }

         return false;
      },

      _afterMount: function(){

      }
   });

   return ViewTemplate;
});