define('Controls/Input/interface/ISuggest', [
], function() {

   /**
    * Интерфейс работы Input.Suggest
    *
    * @mixin Controls/Input/interface/ISuggest
    * @public
    */

   /**
    * @name Controls/Input/interface/ISuggest#suggestTemplate
    * @cfg {Function} Основной шаблон отображения саггеста
    */

   /**
    * @name Controls/Input/interface/ISuggest#suggestFooterTemplate
    * @cfg {Function} Шаблон для отображения футера (кнопка 'показать все')
    */

   /**
    * @name Controls/Input/interface/ISuggest#historyId
    * @cfg {String} Уникальный идентификатор для хранения истории ввода
    */
});