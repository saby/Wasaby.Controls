/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroupBase', ['js!SBIS3.CONTROLS.ButtonGroupBaseDS', 'js!SBIS3.CONTROLS.Selectable'], function(ButtonGroupBase, Selectable) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * @class SBIS3.CONTROLS.RadioGroupBase
    * @mixes SBIS3.CONTROLS.Selectable
    * @extends $ws.proto.Control
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var RadioGroupBase = ButtonGroupBase.extend([Selectable], /** @lends SBIS3.CONTROLS.RadioGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      _drawItemsCallback : function() {
         RadioGroupBase.superclass._drawItemsCallback.call(this);
         if (this._options.selectedKey) {
            this._drawSelectedItem(this._options.selectedKey);
         }
      },

      _itemActivatedHandler : function(key) {
         this.setSelectedKey(key);
      },

      _drawSelectedItem : function(id) {
         var controls = this.getItemsInstances();
         for (var i in controls) {
            if (controls.hasOwnProperty(i)) {
               if (!id && id != 0) {
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
      }
   });
   return RadioGroupBase;
});