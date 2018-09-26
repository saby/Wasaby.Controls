define('Controls-demo/Popup/Compatible/TestValidate', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/Popup/Compatible/TestValidate',
   'SBIS3.CONTROLS/Utils/ControlsValidators'
], function(CompoundControl, dotTplFn) {
   var TestValidate = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      init: function() {
         TestValidate.superclass.init.apply(this, arguments);

         this.getParent().subscribe('onAfterShow', function() {
            this.getChildControlByName('EditAtPlaceComponent').setInPlaceEditMode(true);
            this.getChildControlByName('TextBoxComponent').setActive(true);
         }.bind(this));
      }
   });

   return TestValidate;
});
