/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroupBase', ['js!SBIS3.CONTROLS.ButtonGroupBase', 'js!SBIS3.CONTROLS.Selectable', 'Core/core-instance'], function(ButtonGroupBase, Selectable, cInstance) {

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
         /* Когда Enum работаем через хэши, в остальных случаях через id */
         var isEnum = cInstance.instanceOfModule(this.getItems(), 'WS.Data/Type/Enum'),
             item = this._getItemsProjection().at(index),
             controls = this.getItemsInstances();
         
         if (!isEnum) {
            item = item.getContents();
         }
         
         if (item) {
            var itemId;
            
            if (isEnum) {
               itemId = item.getHash();
            } else {
               itemId = item.get(this._options.idProperty);
            }
            for (var i in controls) {
               if (controls.hasOwnProperty(i)) {
                  if (!itemId) {
                     controls[i].setChecked(false);
                  }
                  else {
                     if (controls[i].getContainer().data(isEnum ? 'hash' : 'id') == itemId) {
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