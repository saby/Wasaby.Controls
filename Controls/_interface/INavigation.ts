/**
 * Интерфейс для поддержки навигации по спискам.
 *
 * @interface Controls/_interface/INavigation
 * @public
 * @author Крайнов Д.О.
 */

/*
 * Interface for list navigation.
 *
 * @interface Controls/_interface/INavigation
 * @public
 * @author Крайнов Д.О.
 */

/**
 * @typedef {String} NavigationSource
 * @variant position Навигация по курсору. Подробнее читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/cursor/ здесь}.
 * @variant page Постраничная навигация.
 */
/*
 * @typedef {String} NavigationSource
 * @variant position Position-based navigation (cursor).
 * @variant page Page-based navigation.
 */
export type TNavigationSource = 'position' | 'page';

/**
 * @typedef {String} NavigationView
 * @variant infinity Бесконечный скролл.
 * @variant pages Страницы с постраничной навигацией.
 * @variant demand Подгружать данные при нажатии на кнопку "Еще".
 * @variant maxCount Подгружать данные, пока не будет достигут порог, указанный в maxCountValue в свойстве viewConfig.
 */

/*
 * @typedef {String} NavigationView
 * @variant infinity Infinite scroll.
 * @variant pages Pages with paging control.
 * @variant demand Load next when requested (for example, hasMore button clicked).
 */
export type TNavigationView = 'infinity' | 'pages' | 'demand' | 'maxCount';

/**
 * @typedef {String} Direction
 * @variant after Загружать данные после позиционируемой записи.
 * @variant before Загружать данные до позиционируемой записи.
 * @variant both Загружать данные в обоих направлениях относительно позиционируемой записи.
 */
export type TNavigationDirection = 'before' | 'after' | 'both';

/**
 * @typedef {Object} PositionSourceConfig Конфигурация для навигации по курсору.
 * @description Подробнее о данном типе навигации читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/cursor/ здесь}.
 * @property {String|Array.<String>} field Имя поля, используемое для навигации по курсору.
 * Для такого поля в таблице БД должен быть создан индекс, иначе теряется смысл использования навигации.
 * @property {String|Array.<String>} position Значение, которое будет начальной позицией для курсора.
 * @property {Direction} direction Направление выборки.
 * @property {Number} limit Ограничение количества записей, запрошенных для одной загрузки.
 */
/*
 * @typedef {Object} PositionSourceConfig Source configuration for position-based (cursor) navigation.
 * @property {String|Array} field Field (fields array) used for position-based navigation.
 * @property {String|Array} position Value of field (fields array) used for position-based navigation.
 * @property {String} direction Loading direction.
 * The following values are supported:
 * <ul>
 *    <li><b>after</b> -  loading data after positional record.
 *    <li><b>before</b> -  loading data before positional record.
 *    <li><b>both</b> -  loading data in both directions relative to the positional record.
 * </ul>
 * @property {Number} limit Limit of records requested for a single load.
 */

export interface INavigationPositionSourceConfig {
   field: string[] | string;
   position?: unknown[] | unknown;
   direction?: TNavigationDirection;
   limit?: number;
}

/**
 * @typedef {Object} PageSourceConfig Конфигурация для постраничной навигации.
 * @property {Number} page Загружать номер страницы.
 * @property {Number} pageSize Загружать размер страницы.
 * @property {Boolean} hasMore Если поле hasMore имеет значение false, аналогичный параметр добавляется в запрос. В ответ, вместо получения флага наличия записей (логическое значение), ожидается общее количество записей (числовое значение).
 */

/*
 * @typedef {Object} PageSourceConfig Source configuration for page-based navigation.
 * @property {Number} page Loading page number.
 * @property {Number} pageSize Loading page size.
 * @property {Boolean} hasMore If hasMore field has false value, similar parameter is added to request. In response instead of receiving a flag for the presence of records (boolean value), the total count of records is expected (number value).
 */
export interface INavigationPageSourceConfig {
    page?: number;
    pageSize: number;
    hasMore?: boolean;
}

/**
 * @typedef {String} TotalInfo
 * @variant basic Отображается только общее число записей.
 * @variant extended отображается общее число записей, номера первой и последней записей на текущей странице, а также размер страницы.
 */
export type TNavigationTotalIngo = 'basic' | 'extended';

/**
 * @typedef {Object} NavigationViewConfig
 * @property {String} [pagingMode=direct] Режим отображения постраничной навигации.
 * В настоящий момент поддерживается навигация только в прямом направлении: от первой страницы до последней.
 * @property {TotalInfo} [totalInfo=basic] Режим отображения информационной подписи.
 * @property {Number} maxCountValue Количество записей, когда необходимо прекратить загрузку в режиме навигации maxCount.
 * О режиме навигации maxCount вы можете посмотреть {@link Controls/_interface/INavigation/Navigation.typedef здесь}.
 */
export interface INavigationViewConfig {
    pagingMode?: string;
    totalInfo?: TNavigationTotalIngo;
}

/**
 * @typedef {Object} Navigation
 * @description Конфигурация навигации в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/ списочном контроле}.
 * Подробнее о настройке навигации читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/navigation/ здесь}.
 * Подробнее о настройке навигации по курсору читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/bllist/cursor/ здесь}.
 * Подробнее об источниках данных читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/data-sources/ здесь}.
 * @property {NavigationSource} source Алгоритм, с которым работает источник данных.
 * @property {NavigationView} view Режим визуального отображения навигации (кнопка навигации и т.д.).
 * @property {PositionSourceConfig|PageSourceConfig} sourceConfig Конфигурация источника данных.
 * @property {NavigationViewConfig} viewConfig Конфигурация визуального отображения навигации.
 */

/*
 * @typedef {Object} Navigation
 * @property {NavigationSource} source Algorithm with which the data source works.
 * @property {NavigationView} view Visual interface for navigation (paging buttons, etc.).
 * @property {PositionSourceConfig|PageSourceConfig} sourceConfig Configuration for data source.
 * @property {NavigationViewConfig} viewConfig Configuration for navigation view.
 */
export interface INavigationOptionValue {
   source?: TNavigationSource;
   view?: TNavigationView;
   sourceConfig?: INavigationPageSourceConfig | INavigationPositionSourceConfig;
   viewConfig?: INavigationViewConfig;
}

export interface INavigationOptions {
   navigation?: INavigationOptionValue;
}

/**
 * @name Controls/_interface/INavigation#navigation
 * @cfg {Navigation} Конфигурация навигации по списку. Настройка навигации источника данных (страниц, смещения, положения) и визуального отображения навигации (страниц, бесконечного скролла и т.д.).
 * @remark
 * Подробнее о конфигурации навигации по списку читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/navigation/ руководстве разработчика}.
 * @example
 * В этом примере в списке будут отображаться 2 элемента.
 * TMPL:
 * <pre>
 *    <Controls.list:View
 *       keyProperty="id"
 *       source="{{_source}}"
 *       navigation="{{_navigation}}"/>
 * </pre>
 * JS:
 * <pre>
 * _beforeMount: function(options) {
 *    this._source = new Memory({
 *      keyProperty: 'id',
 *      data: [
 *         {
 *            id: '1',
 *            title: 'Yaroslavl'
 *         },
 *         {
 *            id: '2',
 *            title: 'Moscow'
 *         },
 *         {
 *            id: '3',
 *            title: 'St-Petersburg'
 *         }
 *      ]
 *    });
 *    this._navigation = {
 *       source: 'page',
 *       view: 'pages',
 *       sourceConfig: {
 *          pageSize: 2,
 *          page: 0
 *       }
 *    };
 * }
 * </pre>
 */

/*
 * @name Controls/_interface/INavigation#navigation
 * @cfg {Navigation} List navigation configuration. Configures data source navigation (pages, offset, position) and navigation view (pages, infinite scroll, etc.)
 * @example
 * In this example, 2 items will be displayed in the list.
 * TMPL:
 * <pre>
 *    <Controls.list:View
 *       keyProperty="id"
 *       source="{{_source}}"
 *       navigation="{{_navigation}}"/>
 * </pre>
 * JS:
 * <pre>
 * _beforeMount: function(options) {
 *    this._source = new Memory({
 *      keyProperty: 'id',
 *      data: [
 *         {
 *            id: '1',
 *            title: 'Yaroslavl'
 *         },
 *         {
 *            id: '2',
 *            title: 'Moscow'
 *         },
 *         {
 *            id: '3',
 *            title: 'St-Petersburg'
 *         }
 *      ]
 *    });
 *    this._navigation = {
 *       source: 'page',
 *       view: 'pages',
 *       sourceConfig: {
 *          pageSize: 2,
 *          page: 0
 *       }
 *    };
 * }
 * </pre>
 */
export default interface INavigation {
    readonly '[Controls/_interface/INavigation]': boolean;
}
