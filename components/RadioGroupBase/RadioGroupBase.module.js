/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroupBase', ['js!SBIS3.CONTROLS.ButtonGroupBase', 'js!SBIS3.CONTROLS._SelectorMixin'], function(ButtonGroupBase, _SelectorMixin) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS.RadioGroupBase
    * @mixes SBIS3.CONTROLS._CollectionMixin
    * @mixes SBIS3.CONTROLS._SelectorMixin
    * @extends SBIS3.CORE.Control
    */

   var RadioGroupBase = ButtonGroupBase.extend([_SelectorMixin], /** @lends SBIS3.CONTROLS.RadioGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
         if (this._selectedItem) {
            this._drawSelectedItem(this._selectedItem);
         }
      },

      _itemActivatedHandler : function(activatedControl) {
         var key = activatedControl.getContainer().data('key');
         this.setSelectedItem(key);
      },

      _drawSelectedItem : function(id) {
         var controls = this.getChildControls();
         for (var i = 0; i < controls.length; i++) {
            if (!id) {
               controls[i].setChecked(false);
            }
            else {
               if (controls[i].getContainer().data('key') == id) {
                  controls[i].setChecked(true);
               }
               else {
                  controls[i].setChecked(false);
               }
            }
         }
      }
   });
   return RadioGroupBase;
});