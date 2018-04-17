define('Controls/interface/IDropdown', [], function() {

   /**
    * Интерфейс работы выпадающих списков.
    * @mixin Controls/interface/IDropdown
    * @public
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.headerConfig
    * @cfg {Object} Конфигурация, по которой строится шаблон шапки
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.keyProperty
    * @cfg {String} Имя свойства элемента, которое является идентификатором записи.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.parentProperty
    * @cfg {String} Имя поля в объекте из набора items, которое используется для создания отношения иерархии.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.nodeProperty
    * @cfg {String} Имя свойства элемента, в котором содержится информация о типе элемента (лист/узел/скрытый узел)
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.itemTemplateProperty
    * @cfg {String} Имя свойства элемента, в котором содержится шаблон отображения этого элемента. При отсутствии шаблона в поле используется шаблон из опции itemTemplate
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.itemTemplate
    * @cfg {Function} Шаблон для отображения элемента коллекции.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.headTemplate
    * @cfg {Function} Шаблон для отображения шапки.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.contentTemplate
    * @cfg {Function} Шаблон для отображения содержимого элемента коллекции.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.footerTemplate
    * @cfg {Function} Шаблон для отображения подвала.
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.showHeader
    * @cfg {Boolean} Отображать шапку
    */

   /**
    * @name Controls/interface/IDropdown#templateOptions.selectedKeys
    * @cfg {String|Array} Выбранные ключи
    */

});
