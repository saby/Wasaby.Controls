import {ICrudPlus} from 'Types/source';

export interface IToolbarSourceOptions {
    source?: ICrudPlus;
}

/**
 * Интерфейс для доступа к источнику данных, который возвращает данные в формате, необходимом для контрола Toolbar или контролов, реализующих Toolbar (например Controls/operationsPanel).
 *
 * @interface Controls/_toolbars/IToolbarSource
 * @public
 * @author Герасимов А.М.
 */
export default interface IToolbarSource {
    readonly '[Controls/_toolbars/IToolbarSource]': boolean;
}

/**
 * @typedef {String} ShowType
 * @variant showType.MENU Элемент отображается только в меню.
 * @variant showType.MENU_TOOLBAR Элемент отображается в меню и в тулбаре.
 * @variant showType.TOOLBAR Элемент отображается только в тулбаре.
 */

/*
 * @typedef {String} ShowType
 * @variant showType.MENU item is displayed only in the menu
 * @variant showType.MENU_TOOLBAR item is displayed in the menu and toolbar
 * @variant showType.TOOLBAR item is displayed only in the toolbar
 */

/**
 * @typedef {String} CaptionPosition
 * @variant left Текст расположен перед иконкой.
 * @variant right Текст расположен после иконки.
 */

/**
 * @typedef {Object} Item
 * @property {Boolean} [item.readOnly] Определяет, может ли пользователь изменить значение контрола. См. {@link UI/_base/Control#readOnly подробнее}.
 * @property {String} [item.caption] Текст кнопки элемента. См. {@link Controls/_interface/ICaption#caption подробнее}.
 * @property {Boolean} [item.contrastBackground] Определяет, имеет ли кнопка элемента фон. См. {@link Controls/_buttons/Button#contrastBackground подробнее}.
 * @property {String} [item.iconStyle] Цвет иконки элемента. См. {@link Controls/_interface/IIconStyle#iconStyle Подробнее}.
 * @property {String} [item.icon] Иконка элемента. См. {@link Controls/_interface/IIcon#icon подробнее}.
 * @property {String} [item.title] Текст элемента.
 * @property {Boolean} [item.showHeader] Определяет, будет ли отображаться шапка у выпадающего списка элемента.
 * @property {String} [item.tooltip] Текст подсказки, при наведении на элемент тулбара. {@link Controls/_interface/ITooltip#tooltip Подробнее}
 * @property {ShowType} [item.showType] Определяет, где будет отображаться элемент. Значение берется из утилиты {@link Controls/Utils/Toolbar}.
 * @property {String} [item.viewMode] Стиль отображения кнопки элемента. См. {@link Controls/_buttons/Button#viewMode подробнее}.
 * @property {CaptionPosition} [item.captionPosition] Определяет, с какой стороны расположен текст кнопки относительно иконки.
 */
/*
 * @typedef {Object} Item
 * @property {Boolean} [item.readOnly] Determines item readOnly state.
 * @property {String} [item.buttonCaption] Caption of toolbar element.
 * @property {Boolean} [item.buttonTransparent] Transparent of toolbar element.
 * @property {String} [item.iconStyle] Icon style of toolbar element.
 * @property {String} [item.icon] Icon of toolbar element.
 * @property {String} [item.title] Determines item caption.
 * @property {Boolean} [item.showHeader] Indicates whether folders should be displayed.
 * @property {String} [item.tooltip] Text of the tooltip shown when the item is hovered over.
 * @property {ShowType} [item.showType] Determines where item is displayed. The value is taken from the util 'Controls/Utils/Toolbar'. {@link Controls/Utils/Toolbar Details}
 * @property {String} [item.buttonStyle] Button style of toolbar element.
 * @property {String} [item.buttonViewMode] Button style of toolbar element.
 */

/**
 * @typedef {Object} SourceCfg
 * @property {Item} [SourceCfg.item] Формат исходной записи.
 */

/*
 * @typedef {Object} SourceCfg
 * @property {Item} [SourceCfg.item] Format of source record.
 */

/**
 * @name Controls/_toolbars/IToolbarSource#source
 * @cfg {SourceCfg} Объект, который реализует интерфейс {@link Types/source/ICrud ICrud}, необходимый для работы с источником данных.
 * @default undefined
 * @remark
 * Может иметь свойства 'title' и 'showType':
 * * 'title' определяет заголовок элемента.
 * * 'showType' определяет, где будет отображаться элемент. Значение берется из утилиты 'Controls/Utils/Toolbar'. {@link Controls/Utils/Toolbar Подробнее}:
 *     * showType.MENU - Элемент отображается только в меню
 *     * showType.MENU_TOOLBAR - Элемент отображается в меню и в тулбаре
 *     * showType.TOOLBAR - Элемент отображается только в тулбаре
 * Для readOnly элемента, установите значение 'true' в поле readOnly.
 * @example
 * Кнопки будут отображены из источника _source. Первый элемент выравнен по левому краю, другие элементы выравнены по правому краю по умолчанию.
 * <pre>
 *    <Controls.toolbars:View keyProperty="key" source="{{_source}}" />
 * </pre>
 * <pre>
 *    import {showType} from 'Controls/Utils/Toolbar';
 *      .....
 *    this._source = new source.Memory({
 *        keyProperty: 'key',
 *        data: [
 *        {
 *           id: '1',
 *           showType: showType.TOOLBAR,
 *           icon: 'icon-Time',
 *           '@parent': false,
 *           parent: null
 *        },
 *        {
 *           id: '2',
 *           title: 'Moscow',
 *           '@parent': false,
 *           parent: null
 *        },
 *        {
 *           id: '3',
 *           title: 'St-Petersburg',
 *           '@parent': false,
 *           parent: null
 *        }
 *        ]
 *    })
 * </pre>
 */

/**
 * @name Controls/_toolbars/IToolbarSource#keyProperty
 * @cfg {String} Имя свойства, содержащего информацию об идентификаторе текущей строки.
 * @remark Например, идентификатор может быть первичным ключом записи в базе данных.
 */
