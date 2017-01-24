define('js!SBIS3.CONTROLS.CommandsButton', [
   'js!SBIS3.CONTROLS.MenuIcon',
   'js!SBIS3.CONTROLS.ContextMenu',
   'css!SBIS3.CONTROLS.CommandsButton'
], function(MenuIcon){

   'use strict';
    /**
     * Класс контрола "Кнопка с иконкой", для которого по умолчанию установлены следующие фиксированные параметры:
     * <ul>
     *     <li><b>Иконка.</b> (опция {@link SBIS3.CONTROLS.IconMixin#icon})
     *     Когда выпадающее меню не отображается, пользователь видит иконку "Стрелка вниз" (ExpandDown) - класс "icon-24 icon-ExpandDown icon-primary".
     *     Когда выпадающе меню отображено, иконка меняется на "Стрелка вверх" (ExpandUp) - класс "icon-24 icon-ExpandUp icon-primary".
     *     Список иконок вы можете найти <a href='https://wi.sbis.ru/docs/icons/'>здесь</a>.
     *     </li>
     *     <li><b>Заголовок в выпадающем меню.</b> (опция {@link SBIS3.CONTROLS.ButtonBase#caption}). Скрыт. По умолчанию установлен css-модификатор "controls-Menu__hide-menu-header".</li>
     *     <li>Для выпадающего меню раскрытие производится в правую сторону от кнопки.</li>
     * </ul>
     *
     *
     * @class SBIS3.CONTROLS.CommandsButton
     * @extends SBIS3.CONTROLS.MenuIcon
     *
     * @author Крайнов Дмитрий Олегович
     *
     * @demo SBIS3.CONTROLS.Demo.CommandsButton
     *
     * @public
     * @control
     * @category Inputs
     */
   var CommandsButton = MenuIcon.extend({
      _modifyOptions: function(opts) {
         opts.className += ' controls-Menu__hide-menu-header';
         opts.icon = 'sprite:icon-24 icon-ExpandDown icon-primary';
         opts.pickerClassName += ' controls-CommandsButton__picker controls-MenuIcon__Menu';
         return CommandsButton.superclass._modifyOptions.call(this, opts);
      },
      _modifyPickerOptions: function(opts) {
         opts.horizontalAlign.side = 'right';
         opts.closeButton = true;
         return opts;
      },
      _setPickerContent: function() {
         CommandsButton.superclass._setPickerContent.apply(this, arguments);
         $('.controls-PopupMixin__closeButton', this._picker.getContainer()).addClass('icon-24 icon-ExpandUp icon-primary');
      }
   });
   return CommandsButton;
});