/* global define, $ws */

/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroupBaseNew', ['js!SBIS3.CONTROLS.ButtonGroupBaseDSNew', 'js!SBIS3.CONTROLS.SelectableNew', 'js!SBIS3.CONTROLS.DisplayFieldMixin'], function(ButtonGroupBase, Selectable, DisplayFieldMixin) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного из нескольких значений при помощи набора радиокнопок. Отображения не имеет.
    * *Это экспериментальный модуль, API будет меняться!*
    * @class SBIS3.CONTROLS.RadioGroupBaseNew
    * @mixes SBIS3.CONTROLS.SelectableNew
    * @extends $ws.proto.Control
    * @state mutable
    * @author Крайнов Дмитрий Олегович
    */

   var RadioGroupBaseNew = ButtonGroupBase.extend([Selectable, DisplayFieldMixin], /** @lends SBIS3.CONTROLS.RadioGroupBaseNew.prototype */ {
      _moduleName: 'SBIS3.CONTROLS.RadioGroupBaseNew',

      getGroupControls: function() {
         return RadioGroupBaseNew.superclass.getGroupControls.call(this).filter(function(control) {
            return $ws.helpers.instanceOfModule(control, 'SBIS3.CONTROLS.RadioButton');
         });
      },

      _itemActivatedHandler: function(index) {
         this.getItemsProjection().setCurrentPosition(index);
      },

      _drawSelectedItem : function() {
         var index = this.getItemsProjection().getCurrentPosition();
         $ws.helpers.forEach(this.getGroupControls(), function(control, controlIndex) {
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