export interface ILookupOptions {
   dataLoadCallback?: Function;
}

/**
 * Интерфейс для полей и кнопок выбора.
 *
 * @interface Controls/_interface/ILookup
 * @public
 * @author Капустин И.А.
 */

/*
 * Interface for fields and selection buttons.
 *
 * @interface Controls/_interface/ILookup
 * @public
 * @author Kapustin I.A.
 */
export default interface ILookup {
   readonly '[Controls/_interface/ILookup]': boolean;
}
/**
 * @name Controls/_interface/ILookup#dataLoadCallback
 * @cfg {Function} Функция обратного вызова, которая вызывается после загрузки данных.
 * @remark
 * dataLoadCallback принимает в качестве первого аргумента коллекцию загруженных элементов.
 * dataLoadCallback может использоваться для установки метаданных или настройки загруженных элементов.
 * @example
 * JS:
 * <pre>
 * _myDataLoadCallback = function(items) {
    *    items.each(function(item) {
    *       item.set(field, value);
    *    });
    * }
 * </pre>
 */
/*
 * @name Controls/_interface/ILookup#dataLoadCallback
 * @cfg {Function} Callback function that will be called when list data loaded by source
 * @remark
 * dataLoadCallback takes to first argument the collection of loaded items.
 * dataLoadCallback can be used for setting metadata or adjusting loaded items.
 * @example
 * JS:
 * <pre>
 * _myDataLoadCallback = function(items) {
 *    items.each(function(item) {
 *       item.set(field, value);
 *    });
 * }
 * </pre>
 */

/**
 * Открыть стековое окно.
 * @function Controls/_interface/ILookup#showSelector
 * @returns {Promise}
 * @param {PopupOptions[]} popupOptions Параметры стекового окна.
 * @example
 * Стековое окно с установленной конфигурацией:
 * wml
 * <pre>
 *     <Controls.lookup:Input
 *           name="directoriesLookup"
 *           bind:selectedKeys="_selectedKeysDirectories"
 *           source="{{_source}}"
 *           searchParam="title"
 *           keyProperty="id">
 *        <ws:placeholder>
 *           Specify the
 *           <Controls.lookup:Link caption="department" on:click="showSelector('department')"/>
 *           and
 *           <Controls.lookup:Link caption="company" on:click="showSelector('company')"/>
 *        </ws:placeholder>
 *        <ws:selectorTemplate templateName="Engine-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs"/>
 *        <ws:suggestTemplate templateName="Controls-demo/Input/Lookup/Suggest/SuggestTemplate"/>
 *     </Controls.lookup:Input>
 * </pre>
 * js
 * <pre>
 *     Control.extend({
    *        ...
    *
    *        showSelector: function(selectedTab) {
    *            this._children.directoriesLookup.showSelector({
    *                templateOptions: {
    *                   selectedTab: selectedTab
    *                }
    *            });
    *        }
    *
    *        ...
    *
    *     });
 * </pre>
 */
/*
 * Open stack popup.
 * @function Controls/_interface/ILookup#showSelector
 * @returns {Promise}
 * @param {PopupOptions[]} popupOptions Stack popup options.
 * @example
 * Open stack with specified configuration.
 * wml
 * <pre>
 *     <Controls.lookup:Input
 *           name="directoriesLookup"
 *           bind:selectedKeys="_selectedKeysDirectories"
 *           source="{{_source}}"
 *           searchParam="title"
 *           keyProperty="id">
 *        <ws:placeholder>
 *           Specify the
 *           <Controls.lookup:Link caption="department" on:click="showSelector('department')"/>
 *           and
 *           <Controls.lookup:Link caption="company" on:click="showSelector('company')"/>
 *        </ws:placeholder>
 *        <ws:selectorTemplate templateName="Engine-demo/Selector/FlatListSelectorWithTabs/FlatListSelectorWithTabs"/>
 *        <ws:suggestTemplate templateName="Controls-demo/Input/Lookup/Suggest/SuggestTemplate"/>
 *     </Controls.lookup:Input>
 * </pre>
 * js
 * <pre>
 *     Control.extend({
 *        ...
 *
 *        showSelector: function(selectedTab) {
 *            this._children.directoriesLookup.showSelector({
 *                templateOptions: {
 *                   selectedTab: selectedTab
 *                }
 *            });
 *        }
 *
 *        ...
 *
 *     });
 * </pre>
 */

/**
 * @event Controls/_interface/ILookup#showSelector Происходит перед открытием справочника через интерфейс.
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
 * @event Controls/_interface/ILookup#showSelector Occurs before opening the selector through the interface.
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
