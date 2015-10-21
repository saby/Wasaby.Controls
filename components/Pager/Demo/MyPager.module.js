define('js!SBIS3.CONTROLS.Demo.MyPager',
      [
         'js!SBIS3.CORE.CompoundControl',
         'html!SBIS3.CONTROLS.Demo.MyPager',
         'js!SBIS3.CONTROLS.Demo.MyListView',
         'js!SBIS3.CONTROLS.Pager'
      ], function(CompoundControl, dotTplFn) {
         /**
          * SBIS3.CONTROLS.Demo.MyPager
          * @class SBIS3.CONTROLS.Demo.MyPager
          * @extends $ws.proto.CompoundControl
          * @control
          */
         var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyPager.prototype */{
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {

               }
            },
            $constructor: function() {
            },

            init: function() {
               moduleClass.superclass.init.call(this);
            }
         });
         return moduleClass;
      });