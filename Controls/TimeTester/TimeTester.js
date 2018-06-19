/**
 * Created by rn.kondakov on 14.06.2018.
 */
define('Controls/TimeTester/TimeTester',
   [
      'Core/Control',
      'tmpl!Controls/TimeTester/TimeTester',
      'Core/helpers/URLHelpers'

   ],

   function(Control,
      template,
      URLHelpers) {
      'use strict';

      return Control.extend({
         _template: template,
         boomCfg: '',
         _beforeMount: function() {
            this.boomCfg = URLHelpers.getQueryParam('boomCfg');
         }
      });
   }
);
