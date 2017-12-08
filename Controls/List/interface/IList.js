define('js!Controls/List/interface/IList', [
], function() {

   /**
    * Интерфейс работы списков.
    *
    * @mixin Controls/List/interface/IList
    * @public
    */

   /**
    * @name Controls/List/interface/IList#contextMenuEnabled
    * @cfg {Boolean} Показывать ли контекстное меню при клике на правую кнопку мыши
    */

   /**
    * @name Controls/List/interface/IList#emptyTemplate
    * @cfg {Function} Шаблон отображения пустого списка
    */

   /**
    * @name Controls/List/interface/IList#footerTemplate
    * @cfg {Function} Устанавливает шаблон, который будет отображаться под элементами коллекции.
    */

   /**
    * @typedef {String} ResultsPosition
    * @variant top отобразить перед списком
    * @variant bottom отобразить после списка
    */

   /**
    * @typedef {Object} Results
    * @property {Function} template шаблон отображения
    * @property {ResultsPosition} position позиция в списке
    */

   /**
    * @name Controls/List/interface/IList#results
    * @cfg {Results} Настройки отображения строки итогов
    */

   /**
    * @name Controls/List/interface/IList#virtualScroll
    * @cfg {Object} Конфигурация виртуального скролла
    */

   /**
    * @name Controls/List/interface/IList#sorting
    * @cfg {Object} Конфигурация сортировки (ключи объекта - названия полей; значения - тип сортировки: 'ASC' - по возрастанию или 'DESC' - по убыванию)
    */

   /**
    * @name Controls/List/interface/IList#multiSelectVisibility
    * @cfg {Boolean} Разрешен ли множественный выбор.
    * @variant visible Показывать всегда
    * @variant hidden Никогда не показывать
    * @variant onhover Показывать только по ховеру
    * @variant null По умолчанию
    */

   /**
    * @name Controls/List/interface/IList#itemActions
    * @cfg {Array} Операции над записью
    */

   /**
    * @name Controls/List/interface/IList#uniqueKeys
    * @cfg {String} Стратегия действий с подгружаемыми в список записями
    * @variant true Мержить, при этом записи с одинаковыми id схлопнутся в одну
    * @variant false Добавлять, при этом записи с одинаковыми id будут выводиться в списке
    */

   /**
    * @function Controls/List/interface/IList#reload
    * Перезагружает набор записей представления данных с последующим обновлением отображения
    */

   /**
    * @event Controls/List/interface/IList#itemClicked Происходит при клике по строке
    */

   /**
    * @event Controls/List/interface/IList#dataLoaded Происходит при загрузке данных
    */
});