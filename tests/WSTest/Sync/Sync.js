/**
 * Created by dv.zuev on 01.08.2017.
 */
define('WSTest/Sync/Sync',
   [
      'Core/Control',
      'tmpl!WSTest/Sync/Sync'
   ],
   function(Base, template) {

      'use strict';

      var Sync = Base.extend({
         _template: template,
         k:0,
         constructor: function(cfg) {
            Sync.superclass.constructor.call(this, cfg);
         },

         eventBut: function(){
            if (this.k) {
               this.k = 0;
            } else {
               this.k = 1;
            }
         }

      });

      return Sync;
   }
)