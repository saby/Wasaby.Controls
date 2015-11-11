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
      init: function(){
         var ccb = new $ws.proto.ControlContextBinder();
         ccb.defineBinding('text', this.getName(), false, undefined, undefined, true);
         ccb.bindControl(this, this.getLinkedContext(), true);
         SuggestTextBox.superclass.init.call(this);
      }
   });

   return SuggestTextBox;
});
