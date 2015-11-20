define('js!SBIS3.CONTROLS.SuggestTextBox', [
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.SuggestMixin'
], function (TextBox, PickerMixin, SuggestMixin) {
   'use strict';
   /**
    * Поле ввода с автодополнением
    * @class SBIS3.CONTROLS.SuggestTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.SuggestMixin
    * @control
    * @public
    * @category Inputs
    * @demo SBIS3.CONTROLS.Demo.MySuggestTextBox Поле ввода с автодополнением
    * @demo SBIS3.CONTROLS.Demo.MySuggestTextBoxDS Поле ввода с автодополнением, использующим DataSource
    * @author Алексей Мальцев
    */
   var SuggestTextBox = TextBox.extend([PickerMixin, SuggestMixin], /** @lends SBIS3.CONTROLS.SuggestTextBox.prototype */ {
      $constructor: function () {
         this._options = $ws.core.merge({
            loadingContainer: this.getContainer().find('.controls-TextBox__fieldWrapper')
         }, this._options);

         this._options.observableControls.unshift(this);

         this.getContainer().addClass('controls-SuggestTextBox');
      },

      _keyUpBind: function(e) {
         SuggestTextBox.superclass._keyUpBind.apply(this, arguments);
         switch (e.which) {
            case $ws._const.key.down:
            case $ws._const.key.up:
            case $ws._const.key.enter:
               if(this.isPickerVisible()) {
                  this._list && this._list._keyboardHover(e);
                  e.preventDefault();
               }
               break;
            case $ws._const.key.esc:
               this.hidePicker();
               break;
         }
      }
   });

   return SuggestTextBox;
});
