/**
 * Интерфейс для поддержки просмотра и редактирования полей фильтра.
 * @interface Controls/_filter/View/interface/IFilterView
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
 * @typedef {String} EditorOptions
 * @property {String} keyProperty Имя свойства, уникально идентифицирующего элемент коллекции.
 * @property {String} displayProperty Имя свойства элемента, содержимое которого будет отображаться. Влияет только на значение при выборе.
 * @property {Types/source:Base} source Объект, который реализует интерфейс ICrud для доступа к данным. Если свойство "items" указано, свойство "source" будет игнорироваться.
 * @property {Boolean} multiSelect Определяет, установлен ли множественный выбор.
 * @property {Controls/interface/ISelectorTemplate} selectorTemplate Шаблон панели выбора элементов.
 * @property {Function} itemTemplate Шаблон рендеринга элементов. Подробнее - {@link Controls/interface/IDropdown#itemTemplate}.
 * Для задания элемента в качестве заголовка используйте шаблон Controls:filterPopup:SimplePanelEmptyItemTemplate.
 * @property {String} itemTemplateProperty Имя свойства, содержащего шаблон для рендеринга элементов. Подробнее - {@link Controls/interface/IDropdown#itemTemplateProperty}
 * Для задания элемента в качестве заголовка используйте шаблон Controls:filterPopup:SimplePanelEmptyItemTemplate.
 * @property {Object} filter Конфигурация фильтра-объект с именами полей и их значениями. {@link Controls/_interface/IFilter}
 * @property {Object} navigation Конфигурация навигации по списку. Настройка навигации источника данных (страницы, смещение, положение) и представления навигации (страницы, бесконечная прокрутка и т. д.) {@link Controls/interface/INavigation}
 * @property {Types/collection:IList} items Специальная структура для визуального представления фильтра. {@link Types/collection:IList}.
 */

/*
 * @typedef {String} EditorOptions
 * @property {String} keyProperty Name of the item property that uniquely identifies collection item.
 * @property {String} displayProperty Name of the item property that content will be displayed. Only affects the value when selecting.
 * @property {Types/source:Base} source Object that implements ICrud interface for data access. If 'items' is specified, 'source' will be ignored.
 * @property {Boolean} multiSelect Determines whether multiple selection is set.
 * @property {Controls/interface/ISelectorTemplate} selectorTemplate Items selection panel template.
 * @property {Function} itemTemplate Template for item render. For more information, see {@link Controls/interface/IDropdown#itemTemplate}
 * @property {String} itemTemplateProperty Name of the item property that contains template for item render. For more information, see {@link Controls/interface/IDropdown#itemTemplateProperty}
 * @property {Object} filter Filter configuration - object with field names and their values. {@link Controls/_interface/IFilter}
 * @property {Object} navigation List navigation configuration. Configures data source navigation (pages, offset, position) and navigation view (pages, infinite scroll, etc.) {@link Controls/interface/INavigation}
 * @property {Types/collection:IList} items Special structure for the visual representation of the filter. {@link Types/collection:IList}.
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
 * @property {String} emptyText Текст пункта, значение которого является значением "по-умолчанию" для фильтра. Пункт будет добавлен в начало списка с заданным текстом.
 * @property {String|Number} emptyKey Первичный ключ для пункта выпадающего списка, который создаётся при установке опции emptyText.
 * @property {EditorOptions} editorOptions Опции для редактора.
 * @property {FilterViewMode} viewMode Режим отображения фильтра.
 * @property {Boolean} doNotSaveToHistory Флаг для отмены сохранения фильтра в истории.
 * @property {Boolean} visibility Отображение параметра фильтрации в блоке "Еще можно отобрать".
 * @property {String} type Тип значения в поле фильтра.
 * Если тип поля не указан, он будет автоматически определяться по значению фильтра.
 * Для каждого типа будет построен соответствующий редактор этого типа.
 *
 * В настоящей версии фреймворка поддерживается только 1 значение — dataRange.
 * При его установке будет построен контрол выбора периода в строке фильтра.
 */

/*
 * @typedef {Object} FilterItem
 * @property {String} name Name of filter field
 * @property {*} value Current filter field value
 * @property {*} resetValue Value for reset
 * @property {String} textValue Text value of filter field.  Used to display a textual representation of the filter
 * @property {EditorOptions} editorOptions Options for editor
 * @property {FilterViewMode} viewMode Filter view mode
 * @property {Boolean} doNotSaveToHistory Flag to cancel saving filter in history
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#source
 * @cfg {Array.<FilterItem>} Специальная структура для визуального представления фильтра.
 * @remark
 * Свойство "value" из каждого элемента будет вставлено в фильтр по имени этого элемента.
 * @example
 * Пример настройки опции "filterSource" для двух фильтров.
 * Первый фильтр отобразится в главном блоке "Отбираются" и не будет сохранен в истории.
 * Второй фильтр будет отображаться в блоке "Еще можно отобрать", так как для него установлено свойство visibility = false.
 * TMPL:
 * <pre>
 *    <Controls.filter:View
 *       source="{{_source}}"
 *       detailPanelTemplateName="wml!MyModule/detailPanelTemplate"
 *       panelTemplateName="Controls/filterPopup:SimplePanel"/>
 * </pre>
 *
 * MyModule/detailPanelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:DetailPanel items="{{items}}">
 *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 *    </Controls.filterPopup:DetailPanel>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'], textValue: '', viewMode: 'frequent', doNotSaveToHistory: true,
 *          editorOptions: {
 *                 source: new sourceLib.Memory({
 *                    keyProperty: 'id',
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
 * @name Controls/_filter/View/interface/IFilterView#source
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
 *       source="{{_source}}" 
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
 *                    keyProperty: 'id',
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
 * @name Controls/_filter/View/interface/IFilterView#detailPanelTemplateName
 * @cfg {String} Шаблон всплывающей панели, которая открывается после клика по кнопке.
 * @remark
 * В качестве шаблона рекомендуется использовать контрол {@link Controls/filterPopup:DetailPanel}
 * Подробнее о настройке панели фильтров читайте <a href='/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/'>здесь</a>.
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
 *    </Controls.filterPopup:DetailPanel>
 * </pre>
 *
 * JS:
 * <pre>
 *    this._items = [
 *       { name: 'type', value: ['1'], resetValue: ['1'] },
 *       { name: 'deleted', value: true, resetValue: false, textValue: 'Deleted', viewMode: extended }
 *    ];
 * </pre>
 * @see <a href='/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/'>Руководство по настройке быстрого фильтра</a>
 * @see Controls.filterPopup:DetailPanel
 */

/*
 * @name Controls/_filter/View/interface/IFilterView#detailPanelTemplateName
 * @cfg {String} Template for the pop-up panel, that opens after clicking on the button.
 * @remark
 * As a template, it is recommended to use the control {@link Controls/filterPopup:DetailPanel}
 * The description of setting up the filter panel you can read <a href='/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/'>here</a>.
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
 * @name Controls/_filter/View/interface/IFilterView#panelTemplateName
 * @cfg {String} Шаблон всплывающей панели быстрых фильтров, которая открывается после клика по параметрам быстрого фильтра.
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
 *                    keyProperty: 'id',
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
 * @name Controls/_filter/View/interface/IFilterView#panelTemplateName
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
 *                    keyProperty: 'id',
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
 * @name Controls/_filter/View/interface/IFilterView#detailPanelTemplateOptions
 * @cfg {Object} Опции для контрола, переданного в {@link detailPanelTemplateName}
 * @example
 * <pre>
 *    <Controls.filter:View
 *       items={{_items}}
 *       detailPanelTemplateName="wml!MyModule/panelTemplate">
 *       <ws:detailPanelTemplateOptions historyId="demo_history_id"/>
 *    </Controls.filter:View>
 * </pre>
 *
 * MyModule/panelTemplate.wml
 * <pre>
 *    <Controls.filterPopup:DetailPanel items="{{items}}" historyId="{{historyId}}">
 *       <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *       <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 *    </Controls.filterPopup:Panel>
 * </pre>
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#panelTemplateOptions
 * @cfg {Object} Опция для контрола, переданного в {@link panelTemplateName}
 * @example
 * <pre>
 *    <Controls.filter:View
 *       items={{_items}}
 *       panelTemplateName="wml!MyModule/panelTemplate">
 *       <ws:panelTemplateOptions itemTemplate="wml!MyModule/panelTemplate/itemTemplate"/>
 *    </Controls.filter:View>
 * </pre>
 *
 * MyModule/panelTemplate/itemTemplate.wml
 * <pre>
 *    <Controls.filterPopup:SimplePanel itemTemplate={{itemTemplate}}>
 *    </Controls.filterPopup:SimplePanel>
 * </pre>
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#alignment
 * @cfg {String} Задаёт выравнивание элементов объединённого фильтра.
 * @remark
 * Варианты значений:
 * 
 * * **right**: Кнопка прикреплена к правому краю. Всплывающая панель открывается влево. Строка выбранных фильтров отображается слева от кнопки.
 * * **left**: Кнопка прикреплена к левому краю. Всплывающая панель открывается вправо. Строка выбранных фильтров отображается справа от кнопки.
 * @default right
 * @example
 * Пример открытия панели фильтров справа:
 * <pre>
 *    <Controls.filter:View
 *       detailPanelTemplateName="wml!MyModule/panelTemplate"
 *       source="{{_source}}"
 *       alignment="left" />
 * </pre>
 */

/*
 * @name Controls/_filter/View/interface/IFilterView#alignment
 * @cfg {String} Sets the direction in which the popup panel will open.
 * @remark
 * * right - The button is attached to the right edge, the pop-up panel opens to the left.
 * * left - The button is attached to the left edge, the pop-up panel opens to the right.
 * @default right
 * @remark
 * The string, that is formed by the values from items, also changes position.
 * @example
 * Example of opening the filter panel in the right
 * <pre>
 *    <Controls.filter:View
 *       detailPanelTemplateName="wml!MyModule/panelTemplate"
 *       source="{{_source}}"
 *       alignment="left" />
 * </pre>
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#itemTemplate
 * @cfg {Function} Шаблон отображения элементов быстрого фильтра.
 * @remark
 * В качестве шаблона рекоммендуется использовать базовый шаблон - "Controls/filter:ViewItemTemplate".
 *
 * Базовый шабон itemTemplate поддерживает следующие параметры:
 *  - contentTemplate {Function} - Шаблон содержимого элемента. По-умолчанию выводится текст выбранного фильтра.
 *  - beforeContentTemplate {Function} - Шаблон, расположенный слева от contentTemplate. По-умолчанию отображается стрелка, если передать null, стрелка отображаться не будет.
 * @example
 * В приведённом примере скрывается стрелка перед текстом быстрого фильтра.
 * WML:
 * <pre>
 *    <Controls.filter:View
 *       source={{_source}}
 *       detailPanelTemplateName="wml!MyModule/detailPanelTemplate"
 *       panelTemplateName="Controls/filterPopup:SimplePanel">
 *
 *       <ws:itemTemplate>
 *          <ws:partial template="Controls/filter:ViewItemTemplate"
 *                      beforeContentTemplate="{{null}}">
 *          </ws:partial>
 *       </ws:itemTemplate>
 *    </Controls.filter:View>
 * </pre>
 */

/**
 * @name Controls/_filter/View/interface/IFilterView#historyId
 * @cfg {String} Уникальный идентификатор для сохранения истории фильтров.
 * В истории будут храниться последние 10 применённых фильров.
 * @remark
 * {@link Controls/_filter/View Controls/filter:View} занимается только отображением истории последних применённых фильтров,
 * чтобы работало сохранение в историю, контрол должен быть обёрнут в {@link Controls/_filter/Controller Controller}.
 * @example
 * WML:
 * <pre>
 *    <Controls.filter:View detailTemplateName="EDO.MyPanelTemplate" historyId="myHistoryId"/>
 * </pre>
 */

/**
 * @event Controls/_filter/View/interface/IFilterView#filterChanged Происходит при изменении фильтра.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object} filter Новый фильтр.
 */

/*
 * @event Controls/_filter/View/interface/IFilterView#filterChanged Happens when filter changed.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Object} filter New filter.
 */

/**
 * @event Controls/_filter/View/interface/IFilterView#sourceChanged Происходит при изменении опции source.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<FilterItem>} items Новая структура фильтра.
 */

/*
 * @event Controls/_filter/View/interface/IFilterView#sourceChanged Happens when source changed.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Object} items New items.
 */

/**
 * Открыть панель фильтрации с шабоном переданным в опции {@link Controls/_filter/View/interface/IFilterView#detailPanelTemplateName detailPanelTemplateName}.
 * @example
 * TS:
 * <pre>
 *    private _openFilter():void {
 *       this._children.filterView.openDetailPanel();
 *    }
 * </pre>
 *
 * WML:
 * <pre>
 *    <Controls.buttons:Button caption='Open filter' on:click='_openFilter()'/>
 *    <Controls.filter:View name='filterView'>
 *       ...
 *    </Controls.filter:View>
 * </pre>
 * @function Controls/_list/interface/IList#reset
 */
/**
 * Сбрасывает фильтрацию к значениям "по-умолчанию".
 * Для всех свойств переданных в опции {@link Controls/_filter/View/interface/IFilterView#source source} в значение value будет установлено значение из resetValue.
 * @example
 * TS:
 * <pre>
 *    private _resetFilter():void {
 *       this._children.filterView.reset();
 *    }
 * </pre>
 *
 * WML:
 * <pre>
 *    <Controls.buttons:Button caption='Reset filter' on:click='_resetFilter()'/>
 *    <Controls.filter:View name='filterView'>
 *       ...
 *    </Controls.filter:View>
 * </pre>
 * @function Controls/_list/interface/IList#reset
 */

/*
 * Open filter panel with template from option {@link Controls/_filter/View/interface/IFilterView#detailPanelTemplateName detailPanelTemplateName}.
 * @example
 * TS:
 * <pre>
 *    private _openFilter():void {
 *       this._children.filterView.openDetailPanel();
 *    }
 * </pre>
 *
 * WML:
 * <pre>
 *    <Controls.buttons:Button caption='Open filter' on:click='_openFilter()'/>
 *    <Controls.filter:View name='filterView'>
 *       ...
 *    </Controls.filter:View>
 * </pre>
 * @function Controls/_list/interface/IList#reset
 */
/*
 * Reset filter.
 * @example
 * TS:
 * <pre>
 *    private _resetFilter():void {
 *       this._children.filterView.reset();
 *    }
 * </pre>
 *
 * WML:
 * <pre>
 *    <Controls.buttons:Button caption='Reset filter' on:click='_resetFilter()'/>
 *    <Controls.filter:View name='filterView'>
 *       ...
 *    </Controls.filter:View>
 * </pre>
 * @function Controls/_list/interface/IList#reset
 */

