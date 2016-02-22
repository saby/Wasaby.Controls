define('js!SBIS3.CONTROLS.Demo.MyToolbar', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MyToolbar',
   'js!SBIS3.CONTROLS.Toolbar',
   'js!SBIS3.CONTROLS.TextArea',
   'js!SBIS3.CONTROLS.SwitcherDouble',
   'js!SBIS3.CONTROLS.CheckBox',
   'js!SBIS3.CONTROLS.Button'
], function (CompoundControl, dotTplFn) {
   'use strict';
   /**
    * SBIS3.CONTROLS.Demo.MyToolbar
    * @class SBIS3.CONTROLS.Demo.MyToolbar
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    */
   var MyToolbar = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyToolbar.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {},
         _textArea: null
      },
      $constructor: function () {
      },

      init: function () {
         MyToolbar.superclass.init.call(this);

         this._textArea = this.getChildControlByName('TextArea');
         $ws.single.CommandDispatcher.declareCommand(this, 'testCommand', this._testCommand);
      },

      addToArea: function(addingText) {
         var text = this._textArea.getText();
         text += '\n'+ addingText;
         this._textArea.setText(text);
      },

      _testCommand: function() {
         this.addToArea('testCommand');
      }
   });
   return MyToolbar;
});