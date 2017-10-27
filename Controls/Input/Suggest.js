define('js!Controls/Input/Suggest', [
], function() {

   /**
    * Поле ввода с автодополнением
    * @class Controls/Input/Suggest
    * @extends Controls/Input/Text
    * @mixes Controls/Input/interface/IInputPlaceholder
    * @mixes Controls/Input/interface/IValidation
    * @mixes Controls/Input/interface/IInputTag
    * @control
    * @public
    * @category Input
    */

   /**
    * @name Controls/Input/Suggest#withoutCross
    * @cfg {Boolean} Скрыть крестик удаления значения
    */


   //ChooserMixin

   /**
    * @name Controls/Input/Suggest#chooserMode
    * @cfg {String} Устанавливает режим отображения диалога выбора элементов коллекции
    * @variant dialog Справочник отображается в новом диалоговом окне
    * @variant floatArea Справочник отображается во всплывающей панели
    */

   /**
    * @event Controls/Input/Suggest#onChooserClick Происходит при клике на кнопку открытия диалога выбора
    */


   //SearchMixin

   /**
    * @name Controls/Input/Suggest#startCharacter
    * @cfg {Number} Минимальное количество символов для отображения автодополнения
    */

   /**
    * @event Controls/Input/Suggest#search Происходит при нажатии на кнопку поиска
    */


   //SuggestMixin

   /**
    * @name Controls/Input/Suggest#autoShow
    * @cfg {Boolean} Показывать автодополнение при пререходе фокуса на контрол
    */

   /**
    * @name Controls/Input/Suggest#list
    * @cfg {Object} Устанавливает конфигурацию выпадающего блока, отображающего список значений для автодополнения
    */

   /**
    * @name Controls/Input/Suggest#listFilter
    * @cfg {Object} Устанавливает параметры фильтрации для списка значений автодополнения
    */

   /**
    * @name Controls/Input/Suggest#showEmptyList
    * @cfg {Boolean} Показывать ли выпадающий блок, при пустом списке
    */


   //SuggestTextBoxMixin

   /**
    * @name Controls/Input/Suggest#keyboardLayoutRevert
    * @cfg {Boolean} Использовать механизм смены неверной раскладки
    */

   /**
    * @name Controls/Input/Suggest#searchParam
    * @cfg {string} Устанавливает имя параметра, который будет передан при вызове метода БЛ
    */

});