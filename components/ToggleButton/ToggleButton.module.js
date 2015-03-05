/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ToggleButton', ['js!SBIS3.CONTROLS.Button', 'js!SBIS3.CONTROLS.Checkable', 'html!SBIS3.CONTROLS.ToggleButton'], function(Button, Checkable, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку с залипанием.
    * @class SBIS3.CONTROLS.ToggleButton
    * @extends SBIS3.CONTROLS.Button
    * @control
    * @demo SBIS3.Demo.Control.MyToggleButton
    * @public
    * @category Buttons
    * @initial
    * <component data-component='SBIS3.CONTROLS.ToggleButton'>
    *    <option name='caption' value='Кнопка с залипанием'></option>
    * </component>
    * @ignoreOptions validators, independentContext, contextRestriction, extendedTooltip
    */

   var ToggleButton = Button.extend([Checkable], /** @lends SBIS3.CONTROLS.ToggleButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         }
      }
   });

   return ToggleButton;

});