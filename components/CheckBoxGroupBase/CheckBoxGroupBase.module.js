/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroupBase', ['js!SBIS3.CONTROLS.ButtonGroupBase', 'js!SBIS3.CONTROLS.MultiSelectorMixin'], function(ButtonGroupBase, MultiSelectorMixin) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного или нескольких значений из набора. Отображения не имеет.
    * @class SBIS3.CONTROLS.CheckBoxGroupBase
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.MultiSelectorMixin
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    */

   var CheckBoxGroupBase = ButtonGroupBase.extend([MultiSelectorMixin], /** @lends SBIS3.CONTROLS.CheckBoxGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
         if (this._items.getItemsCount()) {
            this._drawItems();
         }
      },

      _itemActivatedHandler : function(activatedControl) {
         var key = activatedControl.getContainer().data('id');
         this.toggleItemsSelection([key]);
      },

      _drawItems : function() {
         CheckBoxGroupBase.superclass._drawItems.call(this);
         if (this._options.selectedItems && this._options.selectedItems.length) {
            this._drawSelectedItems(this._options.selectedItems);
         }
      },

      _getAddOptions : function(item) {
         var
            key = this._items.getKey(item),
            caption = this._items.getValue(item, 'title'),
            resObj = {
               caption : caption
            };

         var success = false;
         for (var i = 0; i < this._options.selectedItems.length; i++) {
            if (key == this._options.selectedItems[i]) {
               success = true;
               break;
            }
         }
         if (success) {
            resObj.checked = true;
         }
         return resObj;
      },

      _drawSelectedItems : function(idArray) {
         var
            controls = this._childControls,
            arrLen = idArray.length;

         for (var i = 0; i < controls.length; i++) {
            if (!arrLen) {
               controls[i].setChecked(false);
            }
            else {
               var key = controls[i].getContainer().data('id');
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