/* global define, $ws */

/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroupBaseNew', ['js!SBIS3.CONTROLS.ButtonGroupBaseDSNew', 'js!SBIS3.CONTROLS.SelectableNew'], function(ButtonGroupBase, Selectable) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.RadioGroupBaseNew
    * @mixes SBIS3.CONTROLS.SelectableNew
    * @extends $ws.proto.Control
    * @public
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */

   var RadioGroupBaseNew = ButtonGroupBase.extend([Selectable], /** @lends SBIS3.CONTROLS.RadioGroupBaseNew.prototype */ {
      _moduleName: 'SBIS3.CONTROLS.RadioGroupBaseNew',

      _itemActivatedHandler: function(index) {
         this.getItemsProjection().setCurrentPosition(index);
      },

      _drawSelectedItem : function() {
         var index = this.getItemsProjection().getCurrentPosition();
         $ws.helpers.forEach(this._getView().getComponents(), function(control, controlIndex) {
            if (controlIndex === index) {
               control.setChecked(true);
            } else {
               control.setChecked(false);
            }
         });
      }
   });

   return RadioGroupBaseNew;
});