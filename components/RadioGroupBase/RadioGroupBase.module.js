/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroupBase', ['js!SBIS3.CONTROLS.ButtonGroupBaseDS', 'js!SBIS3.CONTROLS.Selectable'], function(ButtonGroupBase, Selectable) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS.RadioGroupBase
    * @mixes SBIS3.CONTROLS.Selectable
    * @extends SBIS3.CONTROLS.ButtonGroupBaseDS
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var RadioGroupBase = ButtonGroupBase.extend([Selectable], /** @lends SBIS3.CONTROLS.RadioGroupBase.prototype */ {
      $protected: {
         _options: {
            allowEmptySelection: false
         }
      },

      _itemActivatedHandler : function(key) {
         this.setSelectedKey(key);
      },

      _drawSelectedItem : function(id, index) {
         //TODO не будет работать с перечисляемым. Переписать
         var
            item = this.getItems().at(index),
            key;
         if (item) {
            key = item.getId();
            var controls = this.getItemsInstances();
            for (var i in controls) {
               if (controls.hasOwnProperty(i)) {
                  if (!key && key != 0) {
                     controls[i].setChecked(false);
                  }
                  else {
                     if (controls[i].getContainer().data('id') == key) {
                        controls[i].setChecked(true);
                     }
                     else {
                        controls[i].setChecked(false);
                     }
                  }
               }
            }
         }


      }
   });
   return RadioGroupBase;
});