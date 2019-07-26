define('Controls-demo/ReceivedStatesDemo/Wrapper',
   [
      'Core/Control',
      'wml!Controls-demo/ReceivedStatesDemo/Wrapper'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template,
         _beforeMount: function(cfg, _, receivedState) {
            var res = '123';
            if(receivedState === '123') {
               this.gotRS = true;
            } else {
               return new Promise(function(resolve) {
                  resolve(res);
               });
            }
         }
      });
   });
