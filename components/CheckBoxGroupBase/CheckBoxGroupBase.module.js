/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroupBase', ['js!SBIS3.CONTROLS.ButtonGroupBaseDS', 'js!SBIS3.CONTROLS.MultiSelectable'], function(ButtonGroupBase, MultiSelectable) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного или нескольких значений из набора. Отображения не имеет.
    * @class SBIS3.CONTROLS.CheckBoxGroupBase
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.MultiSelectable
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    */

   var CheckBoxGroupBase = ButtonGroupBase.extend([MultiSelectable], /** @lends SBIS3.CONTROLS.CheckBoxGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      },

      _itemActivatedHandler : function(key) {
         this.toggleItemsSelection([key]);
      },

      _drawItemsCallback : function() {
         CheckBoxGroupBase.superclass._drawItemsCallback.call(this);
         if (this._options.selectedItems && this._options.selectedItems.length) {
            this._drawSelectedItems(this._options.selectedItems);
         }
      },

      _drawSelectedItems : function(idArray) {
         var
            controls = this.getItemsInstances(),
            arrLen = idArray.length;

         for (var i in controls) {
            if (controls.hasOwnProperty(i)) {
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
      }

   });

   return CheckBoxGroupBase;

});