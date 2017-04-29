
define('js!SBIS3.CONTROLS.StateButton', [
   'Core/constants',
   'js!WSControls/Buttons/ToggleButton'
], function(constants, WSToggleButton) {

   'use strict';

   /**
    * Контрол, отображающий кнопку со сменой состояний
    * Можно настроить:
    * <ol>
    *    <li>{@link SBIS3.CORE.Control#allowChangeEnable возможность изменения доступности кнопки};</li>
    *    <li>{@link WSControls/Buttons/ButtonBase#caption текст на кнопке};</li>
    *    <li>{@link SBIS3.CORE.Control#enabled возможность взаимодействия с кнопкой};</li>
    *    <li>{@link SBIS3.CONTROLS.IconMixin#icon иконку на кнопке};</li>
    *    <li>{@link SBIS3.CORE.Control#visible видимость кнопки};</li>
    * </ol>
    * @class SBIS3.CONTROLS.StateButton
    * @extends WSControls/Buttons/ToggleButton
	* @demo SBIS3.CONTROLS.Demo.MyButton
    *
    * @author Крайнов Дмитрий Олегович
    *
    * @control
    * @category Buttons
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.Button'>
    *    <option name='caption' value='Изменить'></option>
    *    <option name='checkedCaption' value='Сохранить'></option>
    *    <option name='icon' value='sprite:icon-24 icon-Author icon-primary'></option>
    *    <option name='checkedIcon' value='sprite:icon-24 icon-Save icon-primary'></option>
    *    <option name='className' value='controls-Button controls-Button__default'></option>
    * </component>
    */

   var StateButton = WSToggleButton.extend( /** @lends SBIS3.CONTROLS.StateButton.prototype */ {
       $protected: {
           _options: {
               checkedCaption: null,
               checkedIcon: null
           },
           _caption: null,
           _checkedCaption: null,
           _icon: null,
           _checkedIcon: null
       },

      $constructor: function() {
          this._caption = this.getCaption();
          this._checkedCaption = this._options.checkedCaption;
          this._icon = this.getIcon();
          this._checkedIcon = this._options.checkedIcon;
      },

      setChecked: function(flag) {
          var newChecked = !!flag,
              newIcon = newChecked ? this._checkedIcon : this._icon,
              newCaption = newChecked ? this._checkedCaption : this._caption;

          newIcon && this.setIcon(newIcon);
          newCaption && this.setCaption(newCaption);

          WSToggleButton.superclass.setChecked.apply(this, arguments);
      }

   });

   return StateButton;

});