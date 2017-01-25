/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroupBase', ['js!SBIS3.CONTROLS.ButtonGroupBase', 'js!SBIS3.CONTROLS.Selectable'], function(ButtonGroupBase, Selectable) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS.RadioGroupBase
    * @mixes SBIS3.CONTROLS.Selectable
    * @extends SBIS3.CONTROLS.ButtonGroupBase
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var RadioGroupBase = ButtonGroupBase.extend([Selectable], /** @lends SBIS3.CONTROLS.RadioGroupBase.prototype */ {
      $protected: {
         _options: {
            allowEmptySelection: false
         }
      },

      _itemActivatedHandler : function(hash) {
         var projItem, index;
         projItem = this._getItemsProjection().getByHash(hash);
         index = this._getItemsProjection().getIndex(projItem);
         this.setSelectedIndex(index);
      },

      _drawSelectedItem : function(id, index) {
         //TODO не будет работать с перечисляемым. Переписать
         var
            item = this._getItemsProjection().at(index),
            controls = this.getItemsInstances();
         if (item) {
            var hash = item.getHash();
            for (var i in controls) {
               if (controls.hasOwnProperty(i)) {
                  if (!hash) {
                     controls[i].setChecked(false);
                  }
                  else {
                     if (controls[i].getContainer().data('hash') == hash) {
                        controls[i].setChecked(true);
                     }
                     else {
                        controls[i].setChecked(false);
                     }
                  }
               }
            }
         } else if (this._options.allowEmptySelection)  {
            for (var i in controls) {
               if (controls.hasOwnProperty(i)) {
                  controls[i].setChecked(false);
               }
            }
         }
      }
   });
   return RadioGroupBase;
});