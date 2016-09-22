define('js!SBIS3.CONTROLS.Demo.MyScrollContainer',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyScrollContainer',
      'js!SBIS3.CONTROLS.ScrollContainer',
      'js!SBIS3.CONTROLS.ListView',
      'js!WS.Data/Source/Memory',
      'css!SBIS3.CONTROLS.Demo.MyScrollContainer'
   ],
   function(CompoundControl, dotTplFn) {

      'use strict';

      var MyScrollContainer = CompoundControl.extend({

         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               listConfig: {
                  infiniteScroll: 'down',
                  pageSize: 10
               }
            }
         }
      });

      return MyScrollContainer;
   }

);