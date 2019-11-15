/* eslint-disable */
define('Controls/interface/IDropdownList', [], function() {

   /**
    * Интерфейс для выпадающих списков.
    *
    * @interface Controls/interface/IDropdownList
    * @public
    * @author Золотова Э.Е.
    */

   /*
    * Interface for dropdown lists.
    *
    * @interface Controls/interface/IDropdownList
    * @public
    * @author Золотова Э.Е.
    */

   /**
    * @typedef {String} TypeShadow
    * @variant default Тень отображается по умолчанию.
    * @variant suggestionsContainer Тень отображается справа, слева и снизу.
    */

   /*
    * @typedef {String} TypeShadow
    * @variant default Default shadow
    * @variant suggestionsContainer Shadow on the right, left, bottom
    */

   /**
    * @typedef {String} MenuStyle
    * @variant defaultHead Шапка меню с иконкой и заголовком.
    * @variant duplicateHead Иконка, установленная под первым элементом списка.
    */

   /*
    * @typedef {String} MenuStyle
    * @variant defaultHead The head with icon and caption
    * @variant duplicateHead The icon set under first item
    */

   /**
    * @typedef {Object} HeadConfig
    * @property {MenuStyle} menuStyle
    * @variant defaultHead Шапка меню с иконкой и заголовком.
    * @variant duplicateHead Иконка, установленная под первым элементом списка.
    */

   /*
    * @typedef {Object} HeadConfig
    * @property {MenuStyle} menuStyle
    * @variant defaultHead The head with icon and caption
    * @variant duplicateHead The icon set under first item
    */

   /**
    * @typedef {String|Boolean} EmptyText
    * @remark
    * true - Добавляет пустой элемент с текстом 'Не выбрано'.
    */

   /*
    * @typedef {String|Boolean} EmptyText
    * @remark
    * true - Add empty item with text 'Не выбрано'
    */

   /**
    * @typedef {Object} TemplateOptions
    * @property {HeadConfig} headConfig Конфигурация для рендеринга папок.
    * @property {String} keyProperty Имя параметра, однозначно идентифицирующего элемент коллекции.
    * @property {String} parentProperty Имя поля, содержащего родительский идентификатор элемента.
    * @property {String} nodeProperty Имя параметра, определяющего тип элемента (список, узел, скрытый узел).
    * @property {String} itemTemplateProperty Имя параметра, содержащего шаблон отображения элемента. Если он не установлен, вместо него используется "itemTemplate".
    * @property {Function} itemTemplate Шаблон для рендеринга элементов.
    * @property {Function} headTemplate Шаблон отображения шапки списка.
    * @property {Function} contentTemplate Шаблон отображения списка.
    * @property {Function} footerTemplate Шаблон отображения подвала списка.
    * @property {Boolean} showHeader Определяет, отображаются ли папки.
    * @property {Object} itemsGroup Конфигурация для группировки элементов. Включает в себя функцию группировки и шаблон группы.
    * @property {Boolean} showClose Определяет, отображается ли крестик.
    * @property {Array} selectedKeys Массив ключей выбранных элементов.
    * @property {TypeShadow} typeShadow Указывает тип тени вокруг всплывающего окна.
    * @property {EmptyText} emptyText Добавляет пустой элемент к списку с заданным текстом.
    * @property {Boolean} marker Устанавливает видимость маркера.
    */

   /*
    * @typedef {Object} TemplateOptions
    * @property {HeadConfig} headConfig Configuration for folder render
    * @property {String} keyProperty Name of the item property that uniquely identifies collection item
    * @property {String} parentProperty Name of the field that contains item's parent identifier
    * @property {String} nodeProperty Name of the item property that identifies item type (list, node, hidden node)
    * @property {String} itemTemplateProperty Name of the item property that contains template for item render. If not set, itemTemplate is used instead
    * @property {Function} itemTemplate Template for item render
    * @property {Function} headTemplate Template that will be rendered above the list.
    * @property {Function} contentTemplate Template that will be render the list.
    * @property {Function} footerTemplate Template that will be rendered below the list.
    * @property {Boolean} showHeader Indicates whether folders should be displayed.
    * @property {Object} itemsGroup Configuration for item grouping. Includes grouping function and group template
    * @property {Boolean} showClose Determines whether the cross is displayed.
    * @property {Array} selectedKeys Array of selected items' keys.
    * @property {TypeShadow} typeShadow Specifies the type of shadow around the popup.
    * @property {EmptyText} emptyText Add an empty item to the list with the given text.
    * @property {Boolean} marker Determines whether the marker is displayed around the selected item.
    */

});
