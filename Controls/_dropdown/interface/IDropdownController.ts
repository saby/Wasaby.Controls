import {IControlOptions} from 'UI/Base';
import {INavigationOptions, IFilterOptions, IMultiSelectableOptions} from 'Controls/interface';
import {IMenuPopup} from 'Controls/menu';
import {IDropdownSourceOptions} from './IDropdownSource';
export type TKey = string|number|null;

export interface IDropdownControllerOptions extends IControlOptions, IDropdownSourceOptions, INavigationOptions,
        IFilterOptions, IMultiSelectableOptions, IMenuPopup {
    notifySelectedItemsChanged: Function;
    keyProperty: string;
    notifyEvent: Function;
    lazyItemsLoading?: boolean;
    emptyText?: string;
    selectedItemsChangedCallback?: Function;
    dataLoadErrback?: Function;
    historyId?: string;
    historyNew?: string;
    allowPin?: boolean;
    width?: number;
    popupClassName?: string;
    marker?: boolean;
    typeShadow?: string;
}

/**
 * Интерфейс контроллера выпадающих списков
 * @interface Controls/_dropdown/interface/IDropdownController
 * @mixes Controls/dropdown:IFooterTemplate
 * @mixes Controls/dropdown:IHeaderTemplate
 * @mixes Controls/dropdown:ItemTemplate
 * @public
 * @author Герасимов А.М.
 */

/*
 * @interface Controls/_dropdown/interface/IDropdownController
 * @mixes Controls/dropdown:IFooterTemplate
 * @mixes Controls/dropdown:IHeaderTemplate
 * @mixes Controls/dropdown:ItemTemplate
 * @public
 * @author Герасимов А.М.
 */
export default interface IDropdownController {
    readonly '[Controls/_dropdown/interface/IDropdownController]': boolean;
}

/**
 * @name Controls/_dropdown/interface/IDropdownController#emptyText
 * @cfg {String} Добавляет пустой элемент в список с заданным текстом.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#navigation
 * @cfg {Controls/_interface/INavigation} Конфигурация навигации по списку.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#selectedKeys
 * @cfg {Array.<Number|String>} Массив ключей выбранных элементов.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#lazyItemsLoading
 * @cfg {Boolean} Определяет, будут ли элементы меню загружаться лениво, только после первого клика по элементу, открывающему меню.
 * @default false
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#allowPin
 * @cfg {Boolean} Определяет, можно ли закреплять пункты выпдающего списка.
 * @default false
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#historyId
 * @cfg {String} Уникальный идентификатор для сохранения истории выбора записей.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#width
 * @cfg {Number} Определяет ширину выпадающего списка.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#popupClassName
 * @cfg {String} Класс, который навешивается на всплывающее окно.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#dataLoadErrback
 * @cfg {Function} Функция обратного вызова для определения сбоя загрузки данных из источника.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#itemTemplateProperty
 * @cfg {String} Устанавливает имя поля, которое содержит имя шаблона отображения элемента. Подробнее про найстройку шаблона {@link Controls/dropdown:ItemTemplate здесь}.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#notifySelectedItemsChanged
 * @cfg {Function}  Функция, которая будет вызываться при изменении выбранных значений.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#notifyEvent
 * @cfg {Function}  Функция, которая будет вызываться при изменениях, о котолрых нужно оповетсить родительские контролы.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#marker
 * @cfg {Boolean} Определяет, будет ли маркер отображаться рядом с выбранным элементом.
 */

/**
 * @name Controls/_dropdown/interface/IDropdownController#typeShadow
 * @cfg {String} Задает тип тени вокруг всплывающего окна.
 * @variant default Тень по умолчанию.
 * @variant suggestionsContainer Тень справа, слева, снизу.
 */
