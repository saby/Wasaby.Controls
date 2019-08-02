define('Controls-demo/ReceivedStatesDemo/TestControlWithRS',
   [
      'Core/Control',
      'wml!Controls-demo/ReceivedStatesDemo/TestControlWithRS'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template,
         _beforeMount: function(cfg, _, receivedState) {
            var res = '654';
            if(receivedState === '654') {
               this.gotRSInner = 'true';
               this.gotRSOuter = '' + cfg.wrapperRS;
            } else {
               return new Promise(function(resolve) {
                  resolve(res);
               });
            }
         }
      });
   });
