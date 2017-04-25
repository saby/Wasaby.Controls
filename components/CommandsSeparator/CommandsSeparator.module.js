/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.CommandsSeparator', [
   'js!WSControls/Buttons/ButtonBase',
   'js!SBIS3.CONTROLS.Checkable',
   'tmpl!SBIS3.CONTROLS.CommandsSeparator',
   'css!SBIS3.CONTROLS.CommandsSeparator'
], function(WSButtonBase, Checkable, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий разделитель.
    * @class SBIS3.CONTROLS.CommandsSeparator
    * @extends WSControls/Buttons/ButtonBase
    * @author Крайнов Дмитрий Олегович
    *
    * @public
    * @control
    * @category ButtonsBase
    * @initial
    * <component data-component='SBIS3.CONTROLS.CommandsSeparator'>
    *    <option name='command' value='toggleHistory'></option>
    * </component>
    */

   var CommandsSeparator = WSButtonBase.extend([Checkable], /** @lends SBIS3.CONTROLS.ToggleButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
      }
   });

   return CommandsSeparator;

});