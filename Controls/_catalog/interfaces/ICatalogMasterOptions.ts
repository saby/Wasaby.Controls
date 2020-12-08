import {ICrud} from 'Types/source';
import {ICatalogColumnOptions} from 'Controls/_catalog/interfaces/ICatalogColumnOptions';

/**
 * Интерфейс описывает структуру настроек master-колонки компонента {@link Controls/catalog:View}
 * @interface Controls/catalog:ICatalogMasterOptions
 * @public
 * @author Уфимцев Д.Ю.
 */
export interface ICatalogMasterOptions extends ICatalogColumnOptions {
    //region source options
    /**
     * Источник данных, который будет использован списочным представлением внутри master-колонки.
     * Если не задан, то будет использован источник данных, который указан в основной конфигурации
     * {@link ICatalogOptions.listSource}
     * @see ICatalogOptions.listSource
     */
    listSource?: ICrud;

    /**
     * Имя свойства записи master-списка, содержащего информацию о её идентификаторе.
     */
    keyProperty?: string;
    //endregion

    //region display options
    /**
     * Ширина контентной области master при построении контрола. Значение можно задавать как в пикселях,
     * так и в процентах.
     */
    width?: string | number;

    /**
     * Минимальная ширина контентной области до которой может быть уменьшена ширина master. Значение можно задавать
     * как в пикселях, так и в процентах.
     */
    minWidth?: string | number;

    /**
     * Максимальная ширина контентной области до которой может быть увеличена ширина master. Значение можно задавать
     * как в пикселях, так и в процентах.
     */
    maxWidth?: string | number;

    /**
     * Регулирует видимость master-колонки
     * @default 'hidden'
     */
    visibility?: 'visible' | 'hidden';
    //endregion

    /**
     * Опции для компонента {@link Controls/treeGrid:View}, который отображает master-список.
     * Данные опции перекрывают опции, вычисленные на основании конфигурации
     * {@link ICatalogOptions.master|master-колонки}
     */
    treeGridView?: object;
}
