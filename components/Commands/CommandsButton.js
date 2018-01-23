define('SBIS3.CONTROLS/Commands/CommandsButton', [
   'js!WSControls/Buttons/MenuButton',
   'css!SBIS3.CONTROLS/Commands/CommandsButton',
   'css!SBIS3.CONTROLS/Button/IconButton/IconButton'
], function(MenuIcon){

   'use strict';
    /**
     * Класс контрола "Кнопка с командами", для которого по умолчанию установлены следующие фиксированные параметры:
     * <ul>
     *     <li><b>Иконка.</b> (опция {@link SBIS3.CONTROLS/Mixins/IconMixin#icon})
     *     Когда выпадающее меню не отображается, пользователь видит иконку "Стрелка вниз" (ExpandDown) - класс "icon-24 icon-ExpandDown icon-primary".
     *     Когда выпадающе меню отображено, иконка меняется на "Стрелка вверх" (ExpandUp) - класс "icon-24 icon-ExpandUp icon-primary".
     *     Список иконок вы можете найти <a href='/docs/icons/'>здесь</a>.
     *     </li>
     *     <li><b>Заголовок в выпадающем меню.</b> (опция {@link WSControls/Buttons/ButtonBase#caption}). Скрыт. По умолчанию установлен css-модификатор "controls-Menu__hide-menu-header".</li>
     *     <li>Для выпадающего меню раскрытие производится в правую сторону от кнопки.</li>
     * </ul>
     *
     *
     * @class SBIS3.CONTROLS/Commands/CommandsButton
     * @extends SBIS3.CONTROLS/Menu/MenuIcon
     *
     * @author Крайнов Д.О.
     *
     * @demo SBIS3.CONTROLS.Demo.CommandsButton
     *
     * @public
     * @control
     * @category Input
     */
   var CommandsButton = MenuIcon.extend(/** @lends SBIS3.CONTROLS/Commands/CommandsButton.prototype */{
      _modifyOptions: function(opts) {
         opts.cssClassName += ' controls-Menu__hide-menu-header controls-IconButton controls-CommandsButton';
         opts.icon = 'sprite:icon-size icon-ExpandDown icon-primary';
         opts.pickerClassName += ' controls-CommandsButton__picker';
         opts.className += ' '
         if (opts.pickerConfig) {
            opts.pickerConfig.locationStrategy = 'bodyBounds';
         }
         else {
            opts.pickerConfig = {
               locationStrategy: 'bodyBounds'
            };
         }
         return CommandsButton.superclass._modifyOptions.call(this, opts);
      },
      _modifyPickerOptions: function(opts) {
         opts.horizontalAlign.side = 'right';
         opts.closeButton = true;
         return opts;
      },
      _setPickerContent: function() {
         CommandsButton.superclass._setPickerContent.apply(this, arguments);
         $('.controls-PopupMixin__closeButton', this._picker.getContainer()).addClass('icon-size icon-Close icon-primary');
      }
   });
   return CommandsButton;
});