define('Controls-demo/Popup/Compatible/TestActionParentLink/ParentPanel', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/Popup/Compatible/TestActionParentLink/ParentPanel'
], function(CompoundControl, dotTplFn) {

   var ParentPanel = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      init: function() {
         var
            self = this,
            startActionButton;

         ParentPanel.superclass.init.apply(self, arguments);

         startActionButton = self.getChildControlByName('startActionButton');
         startActionButton.subscribe('onActivated', function() {
            requirejs(['SBIS3.CONTROLS/Action/OpenDialog'], function(OpenDialog) {
               if (!self._action) {
                  self._action = new OpenDialog({
                     mode: 'floatArea',
                     template: 'Controls-demo/Popup/Compatible/TestActionParentLink/ChildPanel'
                  });
               }

               self._action.execute({
                  dialogOptions: {
                     opener: self,
                     parent: startActionButton
                  }
               });
            });
         });
      }
   });

   return ParentPanel;

});
