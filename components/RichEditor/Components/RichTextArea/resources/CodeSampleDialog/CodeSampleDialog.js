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
               closeButton: 'standart',
               closeByExternalClick: true
            }
         },
         init: function(){
            var
               self = this;
            CodeSampleDialog.superclass.init.apply(this, arguments);
            this._okBtn = this.getChildControlByName('Apply');
            this._area = this.getChildControlByName('Area');
            this._type = this.getChildControlByName('Type');
            this._okBtn.subscribe('onActivated', function(){
               self._notify('onApply', self._area.getText(), self._type.getSelectedKey());
               self.hide();
            });
         },
         show: function() {
            CodeSampleDialog.superclass.show.apply(this, arguments);
            this._area.setActive(true);
         },
         setText: function(text) {
            this._area.setText(text);
         },
         $constructor: function() {
            this._publish('onApply');
         }
      });
   return CodeSampleDialog;
});