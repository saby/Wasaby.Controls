define('Controls-demo/CompatibleDemo/WasabyEnv/DemoControls/Container', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/CompatibleDemo/WasabyEnv/DemoControls/Container',
   'UI/Base',
   'Vdom/Vdom',
   'Controls/_input/Text',
   'Controls-demo/CompatibleDemo/WasabyEnv/DemoControls/WasabyContainer'
], function(CompoundControl, template, Base, Vdom, Text, WasabyContainer) {
   'use strict';

   var CompatibleDemoNext = CompoundControl.extend({
      _dotTplFn: template,
      _text: null,

      init: function() {
         CompatibleDemoNext.superclass.init.call(this);

         var WasabyControl, name;
         switch (this._options.caption) {
            case 'WasabyEnv/DemoControls/WasabyContainer':
               WasabyControl = WasabyContainer;
               name = 'myTextBoxWasaby';
               break;
            case 'Control.Input:TextBox':
               WasabyControl = Text;
               name = 'myTextBoxWasaby';
               break;
         }

         this.getChildControlByName('initStatus').setCaption('init');
         this.myTextBoxElement = this._container.find('.for__ws4');
         this.myTextBox = Base.Control.createControl(
            WasabyControl,
            {
               name: name,
            },
            this.myTextBoxElement
         );
         var myTextBox = this.getChildControlByName('TextBoxWrapper');
         var self = this;
         myTextBox.subscribe('onTextChange', function() {
            self.getChildControlByName('initStatus').setCaption('update');
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
