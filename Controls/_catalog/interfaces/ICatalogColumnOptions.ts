import {ICrudPlus} from 'Types/source';

/**
 * Интерфейс, представляющий общую структуру настройки колонок каталога
 * @interface Controls/_catalog/interfaces/ICatalogColumnOptions
 * @private
 * @author Уфимцев Д.Ю.
 */
export interface ICatalogColumnOptions {
    //region source options
    /**
     * Источник данных для списка, расположенного внутри колонки.
     */
    listSource?: ICrudPlus;

    /**
     * Имя свойства, содержащего информацию об идентификаторе текущей строки.
     */
    keyProperty?: string;
    //endregion
}
