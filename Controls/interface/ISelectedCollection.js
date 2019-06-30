define('Controls/interface/ISelectedCollection', [
], function() {
   /**
    * Интерфейс для выбора элементов из списка.
    * @interface Controls/interface/ISelectedCollection
    * @public
    * @author Капустин И.А.
    */
   /*
    * Interface to select items from the list.
    * @interface Controls/interface/ISelectedCollection
    * @public
    * @author Kapustin I.A.
    */

   /**
    * @name Controls/interface/ISelectedCollection#displayProperty
    * @cfg {String} Название поля, значение которого будет отображаться.
    */
   /*
    * @name Controls/interface/ISelectedCollection#displayProperty
    * @cfg {String} Name of the item property which content will be displayed.
    */
   
   /**
    * @name Controls/interface/ISelectedCollection#multiSelect
    * @cfg {Boolean} Режим выбора, если значение false, можно выбрать только один элемент.
    */
   /*
    * @name Controls/interface/ISelectedCollection#multiSelect
    * @cfg {Boolean} Selection mode, if value false you can choose only one item.
    */

   /**
    * @name Controls/interface/ISelectedCollection#maxVisibleItems
    * @cfg {Integer} Максимальное количество элементов для отображения, остальные будут скрыты под счетчиком.
    * @remark
    * Актуально только в многострочном режиме
    */
   /*
    * @name Controls/interface/ISelectedCollection#maxVisibleItems
    * @cfg {Integer} The maximum number of items to display, the rest will be hidden under the counter.
    * @remark
    * only relevant in multi line mode
    */

   /**
    * @name Controls/interface/ISelectedCollection#itemTemplate
    * @cfg {Function|String} Шаблон выбранного элемента.
    * @remark
    * Базовый шаблон для Controls/lookup:Input: "Controls.lookup:ItemTemplate".
    * Базовый шаблон для Controls.lookup:Selector: "Controls.lookup:ButtonItemTemplate".
    * Базовый шаблон поддерживают такие параметры как:
    * <ul>
    *    <li>contentTemplate {Function|String} - Шаблон содержимого элемента.</li>
    *    <li>crossTemplate {Function|String} - Шаблон кнопки удаления.</li>
    *    <li>displayProperty {String} - Имя поля, значение которого будет отображаться.</li>
    *    <li>clickable {Boolean} - Задает стиль кликабельности элементам коллекции, добавляет подчеркивание при наведении, актуален только в случае использования contentTemplate по умолчанию.</li>
    *    <li>size {Enum} - Размер текста для содержимого элемента, актуален только в случае использования contentTemplate по умолчанию.</li>
    *    <ul>
    *       <li>m</li>
    *       <li>l</li>
    *       <li>xl</li>
    *       <li>2xl</li>
    *       <li>3xl</li>
    *    </ul>
    *    <li>style {Enum} - Стиль текста для содержимого элемента, актуален только в случае использования contentTemplate по умолчанию.</li>
    *    <ul>
    *       <li>default</li>
    *       <li>bold</li>
    *       <li>accent</li>
    *       <li>primary</li>
    *    </ul>
    * </ul>
    *
    * Если вы переопределите contentTemplate/crossTemplate, вы не будете уведомлены о событиях itemClick/crossClick.
    * Для правильной работы необходимо пометить свой контент классами:
    * <ul>
    *    <li>js-controls-SelectedCollection__item__caption</li>
    *    <li>js-controls-SelectedCollection__item__cross</li>
    * </ul>
    *
    * @example
    * WML:
    * <pre>
    *    <Controls.lookup:Selector
    *          source="{{_source}}"
    *          keyProperty="id">
    *       <ws:itemTemplate>
    *          <ws:partial template="wml!Controls.lookup:ButtonItemTemplate"
    *                      style="primary"
    *                      size="xl"
    *                      displayProperty="title"
    *                      clickable="{{true}}"/>
    *       </ws:itemTemplate>
    *    </Controls.lookup:Selector>
    * </pre>
    */
   /*
    * @name Controls/interface/ISelectedCollection#itemTemplate
    * @cfg {Function|String} Selected item template.
    * @remark
    * Base itemTemplate for Controls/lookup:Input: "Controls.lookup:ItemTemplate".
    * Base itemTemplate for Controls.lookup:Selector: "Controls.lookup:ButtonItemTemplate".
    * Base itemTemplate supports these parameters:
    * <ul>
    *    <li>contentTemplate {Function|String} - Template for render item content.</li>
    *    <li>crossTemplate {Function|String} - Template for render cross.</li>
    *    <li>displayProperty {String} - Name of the item property which content will be displayed.</li>
    *    <li>clickable {Boolean} - Specifies whether elements are clickable, adds an underscore when the element is hover, is only valid if the default value is used for the contentTemplate.</li>
    *    <li>size {Enum} - The text size for the item content, is only valid if the default value is used for the contentTemplate.</li>
    *    <ul>
    *       <li>m</li>
    *       <li>l</li>
    *       <li>xl</li>
    *       <li>2xl</li>
    *       <li>3xl</li>
    *    </ul>
    *    <li>style {Enum} - The text style for the item content, is only valid if the default value is used for the contentTemplate.</li>
    *    <ul>
    *       <li>default</li>
    *       <li>bold</li>
    *       <li>accent</li>
    *       <li>primary</li>
    *    </ul>
    * </ul>
    *
    * If you reimplement contentTemplate/crossTemplate, you will not be notified of itemClick/crossClick events.
    * To work properly, you need to mark your content with classes:
    * <ul>
    *    <li>js-controls-SelectedCollection__item__caption</li>
    *    <li>js-controls-SelectedCollection__item__cross</li>
    * </ul>
    *
    * @example
    * WML:
    * <pre>
    *    <Controls.lookup:Selector
    *          source="{{_source}}"
    *          keyProperty="id">
    *       <ws:itemTemplate>
    *          <ws:partial template="wml!Controls.lookup:ButtonItemTemplate"
    *                      style="primary"
    *                      size="xl"
    *                      displayProperty="title"
    *                      clickable="{{true}}"/>
    *       </ws:itemTemplate>
    *    </Controls.lookup:Selector>
    * </pre>
    */

   /**
    * @event Controls/interface/ISelectedCollection#textValueChanged Происходит при изменении набора выбранной коллекции.
    * @param {Env/Event:Object} eventObject Декскриптор события.
    * @param {String} textValue Строка, сформированная из выбранных записей.
    * @example
    * В следующем примере создается Selector/Button и демонстрируется сцерий использования.
    * WML:
    * <pre>
    *    <Controls.lookup:Selector
    *       source="{{_source}}"
    *       keyProperty="id"
    *       on:textValueChanged="onTextValueChanged()"
    *    </Controls.lookup:Selector>
    * </pre>
    * JS:
    * <pre>
    *    onTextValueChanged: function(e, textValue) {
    *       UserConfig.setParam('selectedItems', textValue);
    *    }
    * </pre>
    */
   /*
    * @event Controls/interface/ISelectedCollection#textValueChanged Occurs when changing the set of the selected collection.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {String} textValue String formed from selected entries.
    * @example
    * The following example creates Selector/Button and shows how to handle the event.
    * WML:
    * <pre>
    *    <Controls.lookup:Selector
    *       source="{{_source}}"
    *       keyProperty="id"
    *       on:textValueChanged="onTextValueChanged()"
    *    </Controls.lookup:Selector>
    * </pre>
    * JS:
    * <pre>
    *    onTextValueChanged: function(e, textValue) {
    *       UserConfig.setParam('selectedItems', textValue);
    *    }
    * </pre>
    */

   /**
    * @event Controls/interface/ISelectedCollection#itemsChanged Срабатывает при изменении набора выбранной коллекции.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Дескриптор события.
    * @param {RecordSet} items Список выбранных записей.
    * @example
    * В следующем примере создается Selector/Button и демонстрируется сцерий использования.
    * WML:
    * <pre>
    *    <Controls.lookup:Selector
    *       source="{{_source}}"
    *       keyProperty="id"
    *       on:itemsChanged="onItemsChanged()"
    *    </Controls.lookup:Selector>
    * </pre>
    * JS:
    * <pre>
    *    onItemsChanged: function(e, items) {
    *       this.prepareItems(items);
    *    }
    * </pre>
    */
   /*
    * @event Controls/interface/ISelectedCollection#itemsChanged Occurs when changing the set of the selected collection.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {RecordSet} items List of selected entries.
    * @example
    * The following example creates Selector/Button and shows how to handle the event.
    * WML:
    * <pre>
    *    <Controls.lookup:Selector
    *       source="{{_source}}"
    *       keyProperty="id"
    *       on:itemsChanged="onItemsChanged()"
    *    </Controls.lookup:Selector>
    * </pre>
    * JS:
    * <pre>
    *    onItemsChanged: function(e, items) {
    *       this.prepareItems(items);
    *    }
    * </pre>
    */

   /**
    * @event Controls/interface/ISelectedCollection#itemClick Срабатывает при нажатии на элемент коллекции.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Дескриптор события.
    * @param {RecordSet} item Элемент выбраной коллекции.
    */
   /*
    * @event Controls/interface/ISelectedCollection#itemClick Occurs when clicking on a collection item.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {RecordSet} item Item selected collection.
    */

   /**
    * @event Controls/interface/ISelectedCollection#openInfoBox Происходит перед открытием всплывающей подсказки со всеми выбранными записями.
    * @param {Env/Event:Object} eventObject Дескриптор события.
    * @param {Object} config Конфиг, на основе которого будет построена всплывающая подсказка.
    * @example
    * В следующем примере создается Controls/lookup:Input и демонстрируется сцерий использования.
    * WML:
    * <pre>
    *    <Controls.lookup:Input
    *       source="{{_source}}"
    *       keyProperty="id"
    *       searchParam="title"
    *       on:openInfoBox="_openInfoBox()"
    *    </Controls.lookup:Input>
    * </pre>
    * JS:
    * <pre>
    *    _openInfoBox: function(e, config) {
    *       config.maxWidth = 500;
    *       config.templateOptions.items = new collection.List({
    *          items: Chain(config.templateOptions.items).sort(function() {
    *             ...
    *          }).value()
    *       })
    *    }
    * </pre>
    */
   /*
    * @event Controls/interface/ISelectedCollection#openInfoBox Occurs before opening a pop-up with all selected entries.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Object} config Config on which popup will be built.
    * @example
    * The following example creates Controls/lookup:Input and shows how to handle the event.
    * WML:
    * <pre>
    *    <Controls.lookup:Input
    *       source="{{_source}}"
    *       keyProperty="id"
    *       searchParam="title"
    *       on:openInfoBox="_openInfoBox()"
    *    </Controls.lookup:Input>
    * </pre>
    * JS:
    * <pre>
    *    _openInfoBox: function(e, config) {
    *       config.maxWidth = 500;
    *       config.templateOptions.items = new collection.List({
    *          items: Chain(config.templateOptions.items).sort(function() {
    *             ...
    *          }).value()
    *       })
    *    }
    * </pre>
    */

   /**
    * @event Controls/interface/ISelectedCollection#closeInfoBox Срабатывает при закрытии всплывающего окна со всеми выбранными записями.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Дескриптор события.
    */
   /*
    * @event Controls/interface/ISelectedCollection#closeInfoBox Occurs when closing a pop-up with all selected entries.
    * @param {Env/Event:Object} eventObject The event descriptor.
    */

   /**
    * @event Controls/interface/ISelectedCollection#showSelector Происходит перед открытием селектора через интерфейс.
    * @param {Env/Event:Object} eventObject Дескриптор события.
    * @param {PopupOptions[]} popupOptions Параметры стекового окна.
    * @example
    * В следующем примере создается Controls/lookup:Input и показано, как обрабатывать событие.
    * WML:
    * <pre>
    *    <Controls.lookup:Input
    *       source="{{_source}}"
    *       keyProperty="id"
    *       searchParam="title"
    *       on:showSelector="_showSelectorHandler()"
    *    </Controls.lookup:Input>
    * </pre>
    * JS:
    * <pre>
    *    _loadParams: function() {
    *       ...
    *    },
    *
    *    _showSelectorHandler: function(e, popupOptions) {
    *       var self = this;
    *
    *       this._loadParams(popupOptions).addCallback(function(newPopupOptions) {
    *          self.showSelector(newPopupOptions);
    *       });
    *
    *       // cancel the opening of the selector
    *       return false;
    *    }
    * </pre>
    */

   /*
    * @event Controls/interface/ISelectedCollection#showSelector Occurs before opening the selector through the interface.
    * @param {Env/Event:Object} eventObject The event descriptor.
    * @param {PopupOptions[]} popupOptions Stack popup options.
    * @example
    * The following example creates Controls/lookup:Input and shows how to handle the event.
    * WML:
    * <pre>
    *    <Controls.lookup:Input
    *       source="{{_source}}"
    *       keyProperty="id"
    *       searchParam="title"
    *       on:showSelector="_showSelectorHandler()"
    *    </Controls.lookup:Input>
    * </pre>
    * JS:
    * <pre>
    *    _loadParams: function() {
    *       ...
    *    },
    *
    *    _showSelectorHandler: function(e, popupOptions) {
    *       var self = this;
    *
    *       this._loadParams(popupOptions).addCallback(function(newPopupOptions) {
    *          self.showSelector(newPopupOptions);
    *       });
    *
    *       // cancel the opening of the selector
    *       return false;
    *    }
    * </pre>
    */

   /**
    * @typedef {Object} PopupOptions
    * @description Параметры стекового окна.
    * @property {Boolean} autofocus Определяет, на какой элемент необходимо установить фокус сразу после загрузки страницы.
    * @property {Boolean} modal Определяет, является ли окно модальным.
    * @property {String} className Имена классов всплывающих окон.
    * @property {Boolean} closeOnOutsideClick Определяет, возможно ли закрытие всплывающего окна при щелчке за пределами этого окна.
    * @property {function|String} template Шаблон внутри всплывающего окна.
    * @property {function|String} templateOptions Параметры шаблона внутри всплывающего окна.
    * @property {Number} minWidth Минимальная ширина всплывающего окна.
    * @property {Number} maxWidth Максимальная ширина всплывающего окна
    * @property {Number} width Ширина всплывающего окна.
    */

   /*
    * @typedef {Object} PopupOptions
    * @description Stack popup options.
    * @property {Boolean} autofocus Determines whether focus is set to the template when popup is opened.
    * @property {Boolean} modal Determines whether the window is modal.
    * @property {String} className Class names of popup.
    * @property {Boolean} closeOnOutsideClick Determines whether possibility of closing the popup when clicking past.
    * @property {function|String} template Template inside popup.
    * @property {function|String} templateOptions Template options inside popup.
    * @property {Number} minWidth The minimum width of popup.
    * @property {Number} maxWidth The maximum width of popup.
    * @property {Number} width Width of popup.
    */
});
