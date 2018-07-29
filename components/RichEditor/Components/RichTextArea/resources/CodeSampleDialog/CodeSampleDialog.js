define('SBIS3.CONTROLS/RichEditor/Components/RichTextArea/resources/CodeSampleDialog/CodeSampleDialog',
[
   'tmpl!SBIS3.CONTROLS/RichEditor/Components/RichTextArea/resources/CodeSampleDialog/CodeSampleDialog',
   'SBIS3.CONTROLS/CompoundControl',
   'SBIS3.CONTROLS/Mixins/PopupMixin',
   'Lib/Mixins/LikeWindowMixin',
   'SBIS3.CONTROLS/TextArea',
   'SBIS3.CONTROLS/ComboBox',
   'SBIS3.CONTROLS/Button',
   'SBIS3.CONTROLS/Button/IconButton',
   'css!SBIS3.CONTROLS/RichEditor/Components/RichTextArea/resources/CodeSampleDialog/CodeSampleDialog'
], function(dotTplFn, CompoundControl, PopupMixin, LikeWindowMixin) {
   'use strict';

   var
      CodeSampleDialog =  CompoundControl.extend([PopupMixin, LikeWindowMixin], {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               modal: true,
               languages: [
                  {key: 'markup', title: 'HTML/XML'},
                  {key: 'javascript', title: 'JavaScript'},
                  {key: 'css', title: 'CSS'},
                  {key: 'php', title: 'PHP'}
               ],
               windowTitle: 'Вставка кода',
               closeButton: true,
               closeByExternalClick: true
            }
         },

         $constructor: function() {
            this._publish('onApply');
         },

         init: function(){
            CodeSampleDialog.superclass.init.apply(this, arguments);
            this._okBtn = this.getChildControlByName('Apply');
            this._area = this.getChildControlByName('Area');
            this._type = this.getChildControlByName('Type');

            this.subscribeTo(this._area, 'onTextChange', function() {
               this._okBtn.setVisible(!!this._area.getText());
            }.bind(this));

            this.subscribeTo(this._okBtn, 'onActivated', function() {
               this._notify('onApply', this._area.getText(), this._type.getSelectedKey());
               this.hide();
            }.bind(this));
         },

         show: function() {
            CodeSampleDialog.superclass.show.apply(this, arguments);
            this._area.setActive(true);
         },

         setText: function(text) {
            this._area.setText(text);
         }
      });
   return CodeSampleDialog;
});