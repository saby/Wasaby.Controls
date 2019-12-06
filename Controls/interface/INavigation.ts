/**
 * @typedef {Object} IPositionSourceConfig
 * @description Конфигурация для навигации по курсору.
 * @interface
 * @public
 */
export interface IPositionSourceConfig {
    /**
     * Поле (массив полей), используемый для навигации по курсору.
     */
    field?: string | string[];
    /**
     * Значение поля (массива полей), используемого для навигации по курсору.
     */
    position?: string | string[];
    /**
     * Направление загрузки.
     * Поддерживаются следующие значения:
     * <ul>
     *    <li><b>after</b> -  Загружать данные после позиционируемой записи.
     *    <li><b>before</b> -  Загружать данные до позиционируемой записи.
     *    <li><b>both</b> -  Загружать данные в обоих направлениях относительно позиционируемой записи.
     * </ul>
     */
    direction?: 'after' | 'before' | 'both';
    /**
     * Ограничение количества записей, запрошенных для одной загрузки.
     */
    limit?: number;
}
/**
 * @typedef {Object} IPageSourceConfig
 * @description Конфигурация для постраничной навигации.
 * @interface
 * @public
 */
export interface IPageSourceConfig {
    /**
     * Загружать номер страницы.
     */
    page?: number;
    /**
     * Загружать размер страницы.
     */
    pageSize?: number;
    /**
     * Если поле hasMore имеет значение false, аналогичный параметр добавляется в запрос. В ответ, вместо получения флага наличия записей (логическое значение), ожидается общее количество записей (числовое значение).
     */
    hasMore?: boolean;
}

/**
 * @typedef {Object} IViewConfig
 * @description Режим визуального отображения навигации (кнопка навигации и т.д.).
 * @interface
 * @public
 */
export interface IViewConfig {
    /**
     * Режим отображения постраничной навигации.
     * Поддерживаются следующие значения:
     * <ul>
     *    <li><b>direct</b> - Постраничная навигация отображается в прямом направлении: от первой страницы до последней.</li>
     * </ul>
     */
    pagingMode?: 'direct';
    /**
     * Режим отображения информационной подписи.
     * <ul>
     *    <li><b>basic</b> - отображается только общее число записей. (по умолчанию)/li>
     *    <li><b>extended</b> - отображается общее число записей, номера первой и последней записей на текущей странице, а также размер страницы.</li>
     * </ul>
     */
    totalInfo?: 'basic' | 'extended';
    /**
     * Кол-во записей, когда необходимо прекратить загрузку в режиме навигации maxCount.
     * О режиме навигации maxCount вы можете посмотреть тут {@link INavigation}.
     */
    maxCountValue?: number;
}

/**
 * @typedef {String} TNavigationSource
 * @description Тип алгоритма, с которым работает источник данных.
 * @variant position Навигация по курсору.
 * @variant page Постраничная навигация.
 * @public
 */
export type TNavigationSource = 'position' | 'page';
/**
 * @typedef {String} TNavigationView
 * @description Тип режима визуального отображения навигации (кнопка навигации и т.д.).
 * @variant infinity Бесконечный скролл.
 * @variant pages Страницы с постраничной навигацией.
 * @variant demand Подгружать данные при нажатии на кнопку "Еще".
 * @variant maxCount Подгружать данные, пока не будет достигут порог, указанный в maxCountValue, указанный в {@link IViewConfig}.
 * @public
 */
export type TNavigationView = 'infinity' | 'pages' | 'demand' | 'maxCount';

/**
 * Интерфейс для поддержки навигации по спискам.
 *
 * @interface
 * @public
 * @author Крайнов Д.О.
 * @description Конфигурация навигации по списку. Настройка навигации источника данных (страниц, смещения, положения) и визуального отображения навигации (страниц, бесконечного скролла и т.д.).
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
export interface INavigation {
    /**
     * @typedef {TNavigationSource}
     * @description Алгоритм, с которым работает источник данных.
     */
    source: TNavigationSource;
    /**
     * @typedef {TNavigationView}
     * @description Режим визуального отображения навигации (кнопка навигации и т.д.).
     */
    view: TNavigationView;

    /**
     * @description Конфигурация источника данных.
     */
    sourceConfig: IPositionSourceConfig | IPageSourceConfig;
    /**
     * @description Конфигурация визуального отображения навигации.
     */
    viewConfig?: IViewConfig;
}
