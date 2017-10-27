define('js!SBIS3.SPEC.button.SwitcherDouble', [
], function() {

   /**
    * Контрол, отображающий двухпозиционный переключатель для поддержания макетов online.sbis.ru.
    * Переключатель отличается от обычного SBIS3.SPEC.button.Switcher только внешне. Функционально они одинаковые
    * @class SBIS3.SPEC.button.SwitcherDouble
    * @extends SBIS3.SPEC.Control
    * @mixes SBIS3.SPEC.button.interface.ICheckable
    * @control
    * @public
    * @category Buttons
    */

   /**
    * @name SBIS3.SPEC.button.SwitcherDouble#stateOneCaption
    * @cfg {String} Заголовок для первого состояния
    */

   /**
    * @name SBIS3.SPEC.button.SwitcherDouble#stateTwoCaption
    * @cfg {String} Заголовок для второго состояния
    */

   /**
    * @name SBIS3.SPEC.button.SwitcherDouble#orientation
    * @cfg {String} Способ отображения
    * @variant horizontal Горизонтальная ориентация
    * @variant vertical Вертикальная ориентация
    */

});