define('Controls-demo/Popup/Compatible/TestOpener', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/Popup/Compatible/TestOpener'
], function(CompoundControl, dotTplFn) {
   var TestOpener = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      init: function() {
         var self = this;

         TestOpener.superclass.init.apply(this, arguments);

         self.getChildControlByName('openActionButton').subscribe('onActivated', function() {
            requirejs(['SBIS3.CONTROLS/Action/OpenDialog'], function(OpenDialog) {
               if (!self._action) {
                  self._action = new OpenDialog({
                     mode: 'floatArea',
                     template: 'Controls-demo/Popup/Compatible/TestOpener'
                  });
               }

               self._action.execute({
                  dialogOptions: {
                     opener: self
                  }
               });
            });
         });
      }
   });

   return TestOpener;
});
