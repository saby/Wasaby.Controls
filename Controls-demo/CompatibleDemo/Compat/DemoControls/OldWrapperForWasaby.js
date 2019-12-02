define('Controls-demo/CompatibleDemo/Compat/DemoControls/OldWrapperForWasaby', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/CompatibleDemo/Compat/DemoControls/OldWrapperForWasaby',
   'UI/Base',
   'Vdom/Vdom',
   'Controls/_input/Text',
   'Core/helpers/Hcontrol/makeInstanceCompatible'
], function(CompoundControl, template, Base, Vdom, Text, makeInstanceCompatible) {

   var CompatibleDemoNext = CompoundControl.extend({
      _dotTplFn: template,
      _text: null,

      init: function() {
         CompatibleDemoNext.superclass.init.call(this);
         this.myTextBoxElement = this._container.find('.for__ws4');
         this.myTextBox = Base.Control.createControl(
            Text,
            {
               name: 'myTextBox',
               value: this._text,
            },
            this.myTextBoxElement
         );
         makeInstanceCompatible(this.myTextBox);
         var self = this;
         this.myTextBox.subscribe('onTextChange', function(e, text) {
            self.myTextBox.setText(text);
            alert(text);
            self._text = text;
         });
      },

      setTest: function(){
         this.getContainer().find('.textBox');
      },
      destroy: function() {
         if (this.myTextBox) {
            Vdom.Synchronizer.unMountControlFromDOM(
               this.myTextBox,
               this.myTextBoxElement
            );
            this.myTextBox = null;
            this.myTextBoxElement = null;
         }
         CompatibleDemoNext.superclass.destroy.apply(this, arguments);
      }
   });

   return CompatibleDemoNext;
});
