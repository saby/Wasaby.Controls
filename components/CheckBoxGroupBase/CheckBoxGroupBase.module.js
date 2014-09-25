/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroupBase', ['js!SBIS3.CONTROLS.ButtonGroupBase', 'js!SBIS3.CONTROLS._MultiSelectorMixin'], function(ButtonGroupBase, _MultiSelectorMixin) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного или нескольких значений из набора. Отображения не имеет.
    * @class SBIS3.CONTROLS.CheckBoxGroupBase
    * @mixes SBIS3.CONTROLS._CollectionMixin
    * @mixes SBIS3.CONTROLS._MultiSelectorMixin
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    */

   var CheckBoxGroupBase = ButtonGroupBase.extend([_MultiSelectorMixin], /** @lends SBIS3.CONTROLS.CheckBoxGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
         if (this._selectedItems && this._selectedItems.length) {
            this._drawSelectedItems(this._selectedItems);
         }
      },

      _itemActivatedHandler : function(activatedControl) {
         var key = activatedControl.getContainer().data('key');
         this.toggleItemsSelection([key]);
      },

      _drawSelectedItems : function(idArray) {
         var
            controls = this.getChildControls(),
            arrLen = idArray.length;

         for (var i = 0; i < controls.length; i++) {
            if (!arrLen) {
               controls[i].setChecked(false);
            }
            else {
               var key = controls[i].getContainer().data('key');
               if (idArray.indexOf(key) >= 0) {
                  controls[i].setChecked(true);
               }
               else {
                  controls[i].setChecked(false);
               }
            }
         }
      }

   });

   return CheckBoxGroupBase;

});