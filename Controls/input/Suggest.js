define('js!Controls/Input/Suggest', [
], function() {

   /**
    * Поле ввода с автодополнением
    * @class Controls/Input/Suggest
    * @extends Controls/Input/Text
    * @mixes Controls/interface/IDataSource
    * @control
    * @public
    * @category Input
    */

   /**
    * @name Controls/Input/Suggest#withoutCross
    * @cfg {Boolean} Скрыть крестик удаления значения
    */

   /**
    * @name Controls/Input/Suggest#searchStartCharacter
    * @cfg {Number} Минимальное количество символов для отображения автодополнения
    */

   /**
    * @name Controls/Input/Suggest#suggestTemplateName
    * @cfg {String} Имя шаблона списка
    */

   /**
    * @name Controls/Input/Suggest#showEmptySuggest
    * @cfg {Boolean} Показывать ли выпадающий блок, при пустом списке
    */

   /**
    * @name Controls/Input/Suggest#searchParam
    * @cfg {string} Устанавливает имя параметра, который будет передан при вызове метода БЛ
    */

   /**
    * @name Controls/Input/Suggest#debouncingTimeout
    * @cfg {number} Время задержки перед выполнением поиска
    */

   /**
    * @name Controls/Input/Suggest#filter
    * @cfg {Object} Настройки фильтра
    */

});