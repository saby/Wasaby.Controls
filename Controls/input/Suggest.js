define('js!Controls/Input/Suggest', [
], function() {

   /* Не окончательный вариант! Только набросок. */

   /**
    * Поле ввода с автодополнением
    * @class Controls/Input/Suggest
    * @extends Controls/Input/Text
    * @control
    * @public
    * @category Input
    */

   //В базовый???Под вопросом.
   /**
    * @name Controls/Input/Suggest#withoutCross
    * @cfg {Boolean} Скрыть крестик удаления значения
    */

   //Обсуждаемо
   /**
    * @event Controls/Input/Suggest#onChooserClick Происходит при клике на кнопку открытия диалога выбора
    */

   /**
    * @name Controls/Input/Suggest#startCharacter
    * @cfg {Number} Минимальное количество символов для отображения автодополнения
    */

   //Обсуждаемо
   /**
    * @name Controls/Input/Suggest#list
    * @cfg {Object} Устанавливает конфигурацию выпадающего блока, отображающего список значений для автодополнения
    */

   /**
    * @name Controls/Input/Suggest#showEmptySuggest
    * @cfg {Boolean} Показывать ли выпадающий блок, при пустом списке
    */

   /**
    * @name Controls/Input/Suggest#searchParam
    * @cfg {string} Устанавливает имя параметра, который будет передан при вызове метода БЛ
    */

});