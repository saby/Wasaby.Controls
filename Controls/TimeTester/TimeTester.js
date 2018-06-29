/**
 * Created by rn.kondakov on 14.06.2018.
 */
define('Controls/TimeTester/TimeTester',
   [
      'Core/Control',
      'tmpl!Controls/TimeTester/TimeTester',
      'Core/cookie'
   ],

   function(Control,
      template,
      cookie) {
      'use strict';

      return Control.extend({
         _template: template,
         boomCfg: '',
         timeTester: '',
         _beforeMount: function() {
            this.boomCfg = cookie.get('boomCfg');
            this.timeTester = cookie.get('timeTester');
         },
         canAcceptFocus: function() {
            return false;
         }
      });
   }
);
