/**
 * Created by ps.borisov on 29.08.2016.
 */

define('js!SBIS3.CONTROLS.StylesPanel', [
   'Core/CommandDispatcher',
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.StylesPanel',
   'js!SBIS3.CONTROLS.ToggleButton',
   'js!SBIS3.CONTROLS.ComboBox',
   'js!SBIS3.CONTROLS.ColorGroup',
   'js!SBIS3.CONTROLS.IconButton'
], function(CommandDispatcher, CompoundControl, dotTplFn) {

   'use strict';

   /**
    * Радиокнопка выбора цвета
    * @class SBIS3.CONTROLS.ColorRadioButton
    * @extends SBIS3.CONTROLS.RadioButtonBase
    * @public
    * @author Борисов П.С.
    */

   var ColorRadioButton = CompoundControl.extend(/** @lends SBIS3.CONTROLS.ColorRadioButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            title: 'Стиль и цвет'
         }
      },
      $constructor: function(){
         CommandDispatcher.declareCommand(this, 'save', this.saveHandler);
      },
      saveHandler: function(){
         var
            formats = {
               color: this.getChildControlByName('ColorGroup').getSelectedKey(),
               fontsize: this.getChildControlByName('FontSize').getSelectedKey(),
               buttons: {
                  bold: this.getChildControlByName('Bold').isChecked(),
                  italic: this.getChildControlByName('Italic').isChecked(),
                  underline: this.getChildControlByName('Underline').isChecked(),
                  strikethrough: this.getChildControlByName('Strikethrough').isChecked()
               }
            };
         this._options.linkedToolbar._applyFormats(formats);
         this.getTopParent().close();
      }
   });
   return ColorRadioButton;
});