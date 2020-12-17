import {ICrudPlus} from 'Types/source';
import {ICatalogColumnOptions} from 'Controls/_catalog/interfaces/ICatalogColumnOptions';
import {TemplateFunction} from 'UI/Base';

/**
 * Enum со списком доступных вариантов отображения контента в detail-колонке
 */
export enum CatalogDetailViewMode {
    list = 'list',
    tile = 'tile',
    table = 'table'
}

/**
 * Интерфейс описывает структуру настроек detail-колонки компонента {@link Controls/catalog:View}
 * @interface Controls/catalog:ICatalogDetailOptions
 * @public
 * @author Уфимцев Д.Ю.
 */
export interface ICatalogDetailOptions extends ICatalogColumnOptions {
    //region source options
    /**
     * Источник данных, который будет использован списочным представлением внутри detail-колонки.
     * Если не задан, то будет использован источник данных, который указан в основной конфигурации
     * {@link ICatalogOptions.listSource}
     *
     * @see ICatalogOptions.listSource
     */
    listSource?: ICrudPlus;

    /**
     * Имя свойства записи detail-списка, содержащего информацию о её идентификаторе.
     */
    keyProperty?: string;
    //endregion

    //region display options
    /**
     * Опции для компонента {@link Controls/list:View}, который отображается
     * в detail-колонке в режиме {@link CatalogDetailViewMode.list}
     *
     * Данные опции перекрывают опции, вычисленные на основании конфигурации
     * {@link ICatalogOptions.detail|detail-колонки}
     *
     * @see viewMode
     */
    list?: object;

    /**
     * Опции для компонента {@link Controls/treeGrid:View}, который отображается
     * в detail-колонке в режиме {@link CatalogDetailViewMode.table}
     *
     * Данные опции перекрывают опции, вычисленные на основании конфигурации
     * {@link ICatalogOptions.detail|detail-колонки}
     *
     * @see viewMode
     */
    table?: object;
    //endregion

    //region item templates
    /**
     * Шаблон отображения итема плоского списка
     */
    listItemTemplate?: TemplateFunction | string;

    /**
     * Шаблон отображения итема плитки
     */
    tileItemTemplate?: TemplateFunction | string;
    //endregion

    /**
     * Название поле записи в котором лежит ссылка на картинку
     */
    imageProperty?: string;

    nodeProperty?: string;

    parentProperty?: string;

    columns?: unknown;

    filter?: {[key: string]: unknown};
}
