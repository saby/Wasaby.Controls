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
    * @extends $ws.proto.Control
    */

   var RadioGroupBase = ButtonGroupBase.extend([_SelectorMixin], /** @lends SBIS3.CONTROLS.RadioGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {
         if (this._items.getItemsCount()) {
            this._drawItems();
         }
      },

      _getAddOptions : function(item) {
         var
            key = this._items.getKey(item),
            caption = this._items.getValue(item, 'title'),
            resObj = {
               caption : caption
            };


         if (key == this._options.selectedItem) {
            resObj.checked = true;
         }
         return resObj;
      },

      _itemActivatedHandler : function(activatedControl) {
         var key = activatedControl.getContainer().data('id');
         this.setSelectedItem(key);
      },

      _drawSelectedItem : function(id) {
         var controls = this.getChildControls();
         for (var i = 0; i < controls.length; i++) {
            if (!id) {
               controls[i].setChecked(false);
            }
            else {
               if (controls[i].getContainer().data('id') == id) {
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