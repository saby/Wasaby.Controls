define('js!SBIS3.CONTROLS.Demo.MyCheckBoxGroup', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MyCheckBoxGroup', 'css!SBIS3.CONTROLS.Demo.MyCheckBoxGroup', 'js!SBIS3.CONTROLS.CheckBoxGroup'], function(CompoundControl, dotTplFn) {
   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         this.getChildControlByName('CheckBoxGroup 3').subscribe('onDrawItems', function(eventObject) {
            this.setSelectedKeys([1, 2]);
         });
         this.getChildControlByName('CheckBoxGroup 1').subscribe('onDrawItems', function(eventObject) {
            this.setSelectedKeys([1]);
         });
         this.getChildControlByName('CheckBoxGroup 2').subscribe('onDrawItems', function(eventObject) {
            this.setSelectedKeys([2]) ;
         });
      }
   });
   return moduleClass;
});