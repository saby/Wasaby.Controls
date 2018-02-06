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

      },

      _shouldUpdate: function(){

         var self = this,
            cont = document.getElementsByTagName('html')[0];

         self._container = document.getElementsByTagName('html')[0];
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