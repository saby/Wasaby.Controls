import {ICrudPlus, ICrud} from 'Types/source';
import {IPopupOptions} from 'Controls/popup';
import {INavigationOptionValue} from 'Controls/interface';
/**
 * Интерфейс для поддержки просмотра и редактирования полей панели фильтра.
 * @interface Controls/_filter/ViewPanel/interface/IFilterViewPanel
 * @public
 * @author Мельникова Е.А.
 */

/**
 * @name Controls/_filter/View/interface/IFilterViewPanel#source
 * @cfg {Array.<FilterItem>} Устанавливает список полей фильтра и их конфигурацию.
 * В числе прочего, по конфигурации определяется визуальное представление поля фильтра в составе контрола.
 * @demo Controls-demo/Filter_new/FilterView/Source/AdditionalTemplateProperty/Index
 * @example
 * Пример настройки для двух фильтров.
 * Первый фильтр отобразится в главном блоке "Отбираются" и не будет сохранен в истории.
 * Второй фильтр будет отображаться в блоке "Еще можно отобрать", так как для него установлено свойство visibility = false.
 * <pre>
 * <!-- MyModule.wml -->
 * <Controls.filter:View
 *    source="{{_source}}"
 *    detailPanelTemplateName="wml!MyModule/detailPanelTemplate"
 *    panelTemplateName="Controls/filterPopup:SimplePanel"/>
 * </pre>
 * <pre>
 * <!-- detailPanelTemplate.wml -->
 * <Controls.filterPopup:DetailPanel items="{{items}}">
 *    <ws:itemTemplate templateName="wml!MyModule/mainBlockTemplate"/>
 *    <ws:additionalTemplate templateName="wml!MyModule/additionalBlockTemplate"/>
 * </Controls.filterPopup:DetailPanel>
 * </pre>
 * <pre>
 * // MyModule.js
 * _source: null,
 * _beforeMount: function(options) {
 *    this._source = [
 *       { name: 'type', value: ['1'], resetValue: ['1'], textValue: '', viewMode: 'frequent', doNotSaveToHistory: true,
 *          editorOptions: {
 *             source: new sourceLib.Memory({
 *                keyProperty: 'id',
 *                data: [
 *                   { id: '1', title: 'Yaroslavl' },
 *                   { id: '2', title: 'Moscow' },
 *                   { id: '3', title: 'St-Petersburg' }
 *                ]
 *             }),
 *             displayProperty: 'title',
 *             keyProperty: 'id'
 *          }
 *       },
 *       { name: 'group', value: '1', resetValue: 'null', textValue: '', viewMode: 'basic' },
 *       { name: 'deleted', value: true, resetValue: false, textValue: 'Deleted', viewMode: 'extended' }
 *    ];
 * }
 * </pre>
 */

/**
 * @event Происходит при изменении фильтра.
 * @name Controls/_filter/View/interface/IFilterView#filterChanged
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object} filter Новый фильтр.
 * @see sourceChanged
 */

/**
 * @event Происходит при изменении структуры фильтра.
 * @name Controls/_filter/View/interface/IFilterView#sourceChanged
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<FilterItem>} items Новая структура фильтра.
 * @see filterChanged
 */

/**
 * Сбрасывает объединенный фильтр к значениям по умолчанию.
 * Для каждого фильтра такие значения задаются через свойство resetValue при настройке структуры фильтров (см. {@link source}).
 * @name Controls/_filter/View/interface/IFilterView#reset
 * @function
 * @example
 * <pre>
 * // TS
 *    private _resetFilter():void {
 *       this._children.filterView.reset();
 *    }
 * </pre>
 * <pre>
 * <!-- WML -->
 *    <Controls.buttons:Button caption='Reset filter' on:click='_resetFilter()'/>
 *    <Controls.filter:View name='filterView'>
 *       ...
 *    </Controls.filter:View>
 * </pre>
 * @see source
 */
export interface IFilterItem {
    value: any;
    resetValue?: any;
    editorOptions?: {
        source?: ICrudPlus | ICrud;
        keyProperty?: string;
        displayProperty?: string;
        minVisibleItems?: number;
        multiSelect?: boolean;
        selectorTemplate?: {
            templateName: string;
            templateOptions?: Record<string, any>;
            popupOptions?: IPopupOptions;
        }
        itemTemplate?: string;
        editorMode?: string;
        filter?: Record<string, any>;
        navigation?: INavigationOptionValue<any>
        itemTemplateProperty?: string;
    };
}
