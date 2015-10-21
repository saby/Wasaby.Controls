define('js!SBIS3.CONTROLS.Panel', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Panel', 'css!SBIS3.CONTROLS.Panel'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Panel
    * @class SBIS3.CONTROLS.Panel
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    * @designTime actions /design/design
    * @designTime plugin /design/DesignPlugin 
    * @initial
    * <component data-component="SBIS3.CONTROLS.Panel">
    * </component>
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Panel.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {Content}
            */
            content: ""
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