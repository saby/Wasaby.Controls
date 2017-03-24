/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.CommandsSeparator', [
   'js!SBIS3.CONTROLS.ButtonBase',
   'js!SBIS3.CONTROLS.Checkable',
   'html!SBIS3.CONTROLS.CommandsSeparator',
   'css!SBIS3.CONTROLS.CommandsSeparator'
], function(ButtonBase, Checkable, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий разделитель.
    * @class SBIS3.CONTROLS.CommandsSeparator
    * @extends SBIS3.CONTROLS.ButtonBase
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

   var CommandsSeparator = ButtonBase.extend([Checkable], /** @lends SBIS3.CONTROLS.CommandsSeparator.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
      }
   });

   return CommandsSeparator;

});