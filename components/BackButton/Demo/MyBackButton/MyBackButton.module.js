define('js!SBIS3.CONTROLS.Demo.MyBackButton', [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.MyBackButton',
      'js!SBIS3.CONTROLS.BackButton',
      'Core/helpers/fast-control-helpers'
   ],
   function(CompoundControl, dotTplFn, BackButton, fcHelpers) {
      /**
       * SBIS3.CONTROLS.Demo.MyButton
       * @class SBIS3.CONTROLS.Demo.MyButton
       * @extends $ws.proto.CompoundControl
       * @control
       */
      var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyButton.prototype */{
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {

            }
         },
         $constructor: function() {
         },

         init: function() {
            moduleClass.superclass.init.call(this);
            this.getChildControlByName("Button 1").subscribe("onActivated", function() {
               fcHelpers.question("Вернемся назад");
            });
         }
      });
      return moduleClass;
   });