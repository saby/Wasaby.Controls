/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ToggleButton', ['js!SBIS3.CONTROLS.Button', 'js!SBIS3.CONTROLS._CheckedMixin', 'html!SBIS3.CONTROLS.ToggleButton'], function(Button, _CheckedMixin, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку с залипанием.
    * @class SBIS3.CONTROLS.ToggleButton
    * @extends SBIS3.CONTROLS.ToggleButtonBase
    * @control
    * @public
    * @category Buttons
    */

   var ToggleButton = Button.extend([_CheckedMixin], /** @lends SBIS3.CONTROLS.ToggleButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         }
      }
   });

   return ToggleButton;

});