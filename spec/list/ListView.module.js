define('js!SBIS3.SPEC.list.ListView', [
], function() {

   /**
    * Список.
    * @class SBIS3.SPEC.list.ListView
    * @extends SBIS3.SPEC.Control
    * @mixes SBIS3.SPEC.interface.IDataSource
    * @mixes SBIS3.SPEC.interface.IItems
    * @mixes SBIS3.SPEC.interface.ISingleSelectable
    * @mixes SBIS3.SPEC.interface.IPromisedSelectable
    * @mixes SBIS3.SPEC.interface.IGroupedView
    * @control
    * @public
    * @category Lists

    /**
    * @name SBIS3.SPEC.list.ListView#keyProperty
    * @cfg {Object} Имя поля в отображаемом списке, которое однозначно идентифицирует запись.
    */

    /**
    * @name SBIS3.SPEC.list.ListView#filter
    * @cfg {Object} Фильтр.
    */

    /**
    * @name SBIS3.SPEC.list.ListView#navigation
    * @cfg {Object} Настройка навигации.
    */


    /**
    * @name SBIS3.SPEC.list.ListView#multiselect
    * @cfg {Boolean} Разрешен ли множественный выбор.
    */

    /**
    * @name SBIS3.SPEC.list.ListView#itemsActions
     * @cfg {Array} Операции над записью
    */

    /**
    * @name SBIS3.SPEC.list.ListView#emptyTemplate
     * @cfg Шаблон отображения пустого списка
    */

    /**
    * @name SBIS3.SPEC.list.ListView#editingTemplate
     * @cfg Шаблон редактирования строки
    */

   /**
    * @name SBIS3.SPEC.list.ListView#resultTemplate
    * @cfg Шаблон отображения результата
    */

});

/*

dragEntity

dragEntityList

editMode


enabledMove


footerTpl



infiniteScroll

infiniteScrollContainer

infiniteScrollPreloadOffset


itemsDragNDrop


loadItemsStrategy


partialPaging

resultsPosition


showPaging

*/