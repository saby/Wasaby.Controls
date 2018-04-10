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
    * @name Controls/Input/interface/ISuggest#emptyTemplate
    * @cfg {Function} Шаблон, который отображается при отсутствии данных в саггесте
    * @remark Если не установить опцию, то пустой саггест отображаться не будет.
    */

   /**
    * @name Controls/Input/interface/ISuggest#suggestFooterTemplate
    * @cfg {Function} Шаблон для отображения футера (кнопка 'показать все')
    */

   /**
    * @name Controls/Input/interface/ISuggest#historyId
    * @cfg {String} Уникальный идентификатор для хранения истории ввода
    */

   /**
    * @event Controls/Input/interface/ISuggest#choose Происходит при выборе из автодополнения.
    * @param {String} value Новое значение поля.
    */
});
