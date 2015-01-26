/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.IconButton', ['js!SBIS3.CORE.Control', 'js!SBIS3.CONTROLS.ClickMixin', 'js!SBIS3.CONTROLS.IconMixin', 'html!SBIS3.CONTROLS.IconButton'], function(Control, ClickMixin, IconMixin, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий обычную кнопку
    * @class SBIS3.CONTROLS.IconButton
    * @extends SBIS3.CORE.Control
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.IconButton'>
    *    <option name='icon' value='sprite:icon-16 icon-AddButton icon-primary'></option>
    * </component>
    * @public
    * @category Buttons
    * @mixes SBIS3.CONTROLS.IconMixin
    * @mixes SBIS3.CONTROLS.ClickMixin
    */

   var IconButton = Control.Control.extend([ClickMixin, IconMixin], /** @lends SBIS3.CONTROLS.IconButton.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
         }
      },

      setIcon: function(icon){
         IconButton.superclass.setIcon.call(this, icon);
         this._container.removeClass().addClass('controls-IconButton ' + this._iconClass);
      }
   });

   return IconButton;

});