/**
 * Интерфейс для поддержки просмотра и редактирования полей фильтра.
 * @interface Controls/_filter/interface/IFilterView
 * @public
 * @author Золотова Э.Е.
 */

/*
 * Provides a user interface for browsing and editing the filter fields.
 * @interface Controls/_filter/interface/IFilterView
 * @public
 * @author Золотова Э.Е.
 */

/**
 * @typedef {String} FilterViewMode
 * @variant frequent Фильтр, отображаемый в быстрых фильтрах.
 * @variant basic Фильтр, отображаемый в блоке "Отбираются".
 * @variant extended Фильтр, отображаемый в блоке "Еще можно отобрать".
 */

/*
 * @typedef {String} FilterViewMode
 * @variant frequent Filter is displayed in fast filters.
 * @variant basic Filter is displayed in the "Selected" block.
 * @variant extended Filter is displayed if the "Also possible to select" block.
 */

/**
 * @typedef {Object} FilterItem
 * @property {String} name Имя поля фильтра.
 * @property {*} value Текущее значение поля фильтра.
 * @property {*} resetValue Значение поля при сбрасывании фильтра.
 * @property {String} textValue Текстовое значение поля фильтра. Используется для отображения текста у кнопки фильтра.
 * @property {FilterViewMode} viewMode Режим отображения фильтра.
 */

/*
 * @typedef {Object} FilterItem
 * @property {String} name Name of filter field
 * @property {*} value Current filter field value
 * @property {*} resetValue Value for reset
 * @property {String} textValue Text value of filter field.  Used to display a textual representation of the filter
 * @property {FilterViewMode} viewMode Filter view mode
 */

/**
 * @name Controls/_filter/interface/IFilterView#source
 * @cfg {Array.<FilterItem>} Специальная структура для визуального представления фильтра.
 * @remark
 * Свойство "value" из каждого элемента будет вставлено в фильтр по имени этого элемента.
 * @example
 * Пример настройки опции "filterSource" для двух фильтров.
 * Первый фильтр отобразится в главном блоке "Отбираются".
 * Второй фильтр будет отображаться в блоке "Еще можно отобрать", так как для него установлено свойство visibility = false.
 * TMPL:
 * <pre>
 *    <Controls.filter:View
 *       source={{_source}}
 *       detailPanelTemplateName="wml!MyModule/detailPanelTemplate"
 *       panelTemplateName="Controls/filterPopup:SimplePanel"/>
 * </pre>
 *
 * MyModule/detailPanelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:DetailPanel>
 *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 *    </Controls.filterPopup:DetailPanel>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'], textValue: '', viewMode: 'frequent',
 *          editorOptions: {
 *                 source: new sourceLib.Memory({
 *                    idProperty: 'id',
 *                    data: [
 *                       { id: '1', title: 'Yaroslavl' },
 *                       { id: '2', title: 'Moscow' },
 *                       { id: '3', title: 'St-Petersburg' }
 *                    ]
 *                 }),
 *                 displayProperty: 'title',
 *                 keyProperty: 'id'
 *          }
 *       },
 *       { name: 'group', value: '1', resetValue: 'null', textValue: '', viewMode: 'basic' },
 *       { name: 'deleted', value: true, resetValue: false, textValue: 'Deleted', viewMode: 'extended' }
 *    ];
 * </pre>
 */

/*
 * @name Controls/_filter/interface/IFilterView#source
 * @cfg {Array.<FilterItem>} Special structure for the visual representation of the filter.
 * @remark
 * The "value" from every item will insert in filter by "name" of this item.
 * @example
 * Example setting option "filterSource" for two filters.
 * The first filter will be displayed in the main block "Selected"
 * The second filter will be displayed in the "Also possible to select" block, because the property is set for it visibility = false.
 * TMPL:
 * <pre>
 *    <Controls.filter:View
 *       source={{_source}}
 *       detailPanelTemplateName="wml!MyModule/detailPanelTemplate"
 *       panelTemplateName="Controls/filterPopup:SimplePanel"/>
 * </pre>
 *
 * MyModule/detailPanelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:DetailPanel>
 *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 *    </Controls.filterPopup:DetailPanel>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'], textValue: '', viewMode: 'frequent',
 *          editorOptions: {
 *                 source: new sourceLib.Memory({
 *                    idProperty: 'id',
 *                    data: [
 *                       { id: '1', title: 'Yaroslavl' },
 *                       { id: '2', title: 'Moscow' },
 *                       { id: '3', title: 'St-Petersburg' }
 *                    ]
 *                 }),
 *                 displayProperty: 'title',
 *                 keyProperty: 'id'
 *          }
 *       },
 *       { name: 'group', value: '1', resetValue: 'null', textValue: '', viewMode: 'basic' },
 *       { name: 'deleted', value: true, resetValue: false, textValue: 'Deleted', viewMode: 'extended' }
 *    ];
 * </pre>
 */


/**
 * @name Controls/_filter/interface/IFilterView#detailPanelTemplateName
 * @cfg {String} Шаблон всплывающей панели быстрых фильтров, которая открывается после клика по кнопке.
 * @remark
 * В качестве шаблона рекомендуется использовать контрол {@link Controls/filterPopup:DetailPanel}
 * Подробнее о настройке панели фильтров читайте <a href='/doc/platform/developmentapl/interface-development/controls/filterbutton-and-fastfilters/'>здесь</a>.
 * Важно: для ленивой загрузки шаблона в опции укажите путь до контрола. 
 * @example
 * Пример настройки параметров для двух фильтров.
 * Шаблоны отображения обоих фильтров в главном блоке находятся в разделе "MyModule/mainBlockTemplate.wml"
 * Шаблоны отображения второго фильтра в дополнительном блоке находятся в разделе "MyModule/additionalBlockTemplate.wml"
 * TMPL:
 * <pre>
 *    <Controls.filter:View
 *       items={{_items}}
 *       detailPanelTemplateName="wml!MyModule/panelTemplate"/>
 * </pre>
 *
 * MyModule/panelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:DetailPanel>
 *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 *    </Controls.filterPopup:Panel>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._items = [
 *       { name: 'type', value: ['1'], resetValue: ['1'] },
 *       { name: 'deleted', value: true, resetValue: false, textValue: 'Deleted', viewMode: extended }
 *    ];
 * </pre>
 * @see <a href='/doc/platform/developmentapl/interface-development/controls/filterbutton-and-fastfilters/'>Guide for setup Filter Button and Fast Filter</a>
 * @see Controls.filterPopup:DetailPanel
 */

/*
 * @name Controls/_filter/interface/IFilterView#detailPanelTemplateName
 * @cfg {String} Template for the pop-up panel, that opens after clicking on the button.
 * @remark
 * As a template, it is recommended to use the control {@link Controls/filterPopup:DetailPanel}
 * The description of setting up the filter panel you can read <a href='/doc/platform/developmentapl/interface-development/controls/filterbutton-and-fastfilters/'>here</a>.
 * Important: for lazy loading template in the option give the path to the control
 * @example
 * Example setting options for two filters.
 * Templates for displaying both filters in the main block are in "MyModule/mainBlockTemplate.wml"
 * Templates for displaying second filter in the additional block are in "MyModule/additionalBlockTemplate.wml"
 * TMPL:
 * <pre>
 *    <Controls.filter:View
 *       items={{_items}}
 *       detailPanelTemplateName="wml!MyModule/panelTemplate"/>
 * </pre>
 *
 * MyModule/panelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:DetailPanel>
 *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 *    </Controls.filterPopup:Panel>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._items = [
 *       { name: 'type', value: ['1'], resetValue: ['1'] },
 *       { name: 'deleted', value: true, resetValue: false, textValue: 'Deleted', viewMode: extended }
 *    ];
 * </pre>
 * @see <a href='/doc/platform/developmentapl/interface-development/controls/filterbutton-and-fastfilters/'>Guide for setup Filter Button and Fast Filter</a>
 * @see Controls.filterPopup:DetailPanel
 */

/**
 * @name Controls/_filter/interface/IFilterView#panelTemplateName
 * @cfg {String} Шаблон всплывающей панели, которая открывается после клика 
 * @remark
 * В качестве шаблона ркомендуется использовать {@link Controls/filterPopup:SimplePanel}
 * При указании panelTemplateName, параметр items должен быть передан в шаблон.
 * Важно: для ленивой загрузки шаблона в опции укажите путь до контрола.
 * @example
 * TMPL:
 * <pre>
 *    <Controls.filter:View
 *       source={{_source}}
 *       panelTemplateName="MyModule/panelTemplate"/>
 * </pre>
 *
 * MyModule/panelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:SimplePanel items={{_options.items}}/>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'], viewMode: 'frequent',
 *          editorOptions: {
 *                 source: new sourceLib.Memory({
 *                    idProperty: 'id',
 *                    data: [
 *                       { id: '1', title: 'Yaroslavl' },
 *                       { id: '2', title: 'Moscow' },
 *                       { id: '3', title: 'St-Petersburg' }
 *                    ]
 *                 }),
 *                 displayProperty: 'title',
 *                 keyProperty: 'id'
 *          }
 *       }
 *    ];
 * </pre>
 * @see Controls.filterPopup:SimplePanel
 */

/*
 * @name Controls/_filter/interface/IFilterView#panelTemplateName
 * @cfg {String} Template for the pop-up panel, that opens after clicking on fast filter parameters.
 * @remark
 * As a template, it is recommended to use the control {@link Controls/filterPopup:SimplePanel}
 * When specifying the panelTemplateName, the items option must be forwarded to the template.
 * Important: for lazy loading template in the option give the path to the control
 * @example
 * TMPL:
 * <pre>
 *    <Controls.filter:View
 *       source={{_source}}
 *       panelTemplateName="MyModule/panelTemplate"/>
 * </pre>
 *
 * MyModule/panelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:SimplePanel items={{_options.items}}/>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'], viewMode: 'frequent',
 *          editorOptions: {
 *                 source: new sourceLib.Memory({
 *                    idProperty: 'id',
 *                    data: [
 *                       { id: '1', title: 'Yaroslavl' },
 *                       { id: '2', title: 'Moscow' },
 *                       { id: '3', title: 'St-Petersburg' }
 *                    ]
 *                 }),
 *                 displayProperty: 'title',
 *                 keyProperty: 'id'
 *          }
 *       }
 *    ];
 * </pre>
 * @see Controls.filterPopup:SimplePanel
 */

/**
 * @name Controls/_filter/interface/IFilterView#alignment
 * @cfg {String} Устанавливает выравнивание кнопки фильтров.
 * @variant right Кнопка прикреплена к правому краю, всплывающая панель открывается слева.
 * @variant left Кнопка прикреплена к левому краю, всплывающая панель открывается справа.
 * @default right
 * @remark
 * Строка, которая формируется значениями из items, а также меняет позицию.
 * @example
 * Пример открытия панели фильтров справа:
 * <pre>
 *    <Controls.filter:Selector
 *       detailPanelTemplateName="wml!MyModule/panelTemplate"
 *       source="{{_source}}"
 *       alignment="left" />
 * </pre>
 */

/*
 * @name Controls/_filter/interface/IFilterView#alignment
 * @cfg {String} Sets the direction in which the popup panel will open.
 * @variant right The button is attached to the right edge, the pop-up panel opens to the left.
 * @variant left The button is attached to the left edge, the pop-up panel opens to the right.
 * @default right
 * @remark
 * The string, that is formed by the values from items, also changes position.
 * @example
 * Example of opening the filter panel in the right
 * <pre>
 *    <Controls.filter:Selector
 *       detailPanelTemplateName="wml!MyModule/panelTemplate"
 *       source="{{_source}}"
 *       alignment="left" />
 * </pre>
 */

/**
 * @event Controls/_filter/interface/IFilterView#filterChanged Происходит при изменении фильтра.
 * @param {Env/Event:Object} eventObject Дескриптор события.
 * @param {Object} filter Новый фильтр.
 */

/*
 * @event Controls/_filter/interface/IFilterView#filterChanged Happens when filter changed.
 * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
 * @param {Object} filter New filter.
 */

/**
 * @event Controls/_filter/interface/IFilterView#itemsChanged Происходит при изменении опции items.
 * @param {Env/Event:Object} eventObject Дескриптор события.
 * @param {Object} items Новый элемент.
 */

/*
 * @event Controls/_filter/interface/IFilterView#itemsChanged Happens when items changed.
 * @param {Env/Event:Object} eventObject Descriptor of the event.
 * @param {Object} items New items.
 */
