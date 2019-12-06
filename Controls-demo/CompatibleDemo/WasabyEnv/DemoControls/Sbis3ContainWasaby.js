define('Controls-demo/CompatibleDemo/WasabyEnv/DemoControls/Sbis3ContainWasaby', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/CompatibleDemo/WasabyEnv/DemoControls/Sbis3ContainWasaby',
   'UI/Base',
   'Vdom/Vdom',
   'Controls/_input/Text',
   'Core/helpers/Hcontrol/makeInstanceCompatible'
], function(CompoundControl, template, Base, Vdom, Text, makeInstanceCompatible) {

   var CompatibleDemoNext = CompoundControl.extend({
      _dotTplFn: template,
      _text: null,

      init: function(opts) {
         CompatibleDemoNext.superclass.init.call(this);
         this.myTextBoxElement = this._container.find('.for__ws4');
         this.myTextBox = Base.Control.createControl(
            Text,
            {
               name: 'myTextBoxWasaby',
            },
            this.myTextBoxElement
         );
         makeInstanceCompatible(this.myTextBox);
         this.subscribeTo(this.myTextBox, 'onTextChange', function() {
         //    alert(1);
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
