/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.IconButton', ['js!SBIS3.CORE.Control', 'js!SBIS3.CONTROLS.ClickMixin', 'html!SBIS3.CONTROLS.IconButton'], function(Control, ClickMixin, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий обычную кнопку
    * @class SBIS3.CONTROLS.IconButton
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.IconButton' style='width: 100px'>
    *    <option name='caption' value='Кнопка'></option>
    * </component>
    * @public
    * @category Buttons
    */

   var IconButton = Control.Control.extend([ClickMixin], /** @lends SBIS3.CONTROLS.IconButton.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {String}  Путь до иконки
             * Путь задаётся относительно корня сайта либо через sprite.
             * @see setIcon
             * @see getIcon
             * @editor ImageEditor
             */
            icon: ''
         }
      }      
   });

   return IconButton;

});