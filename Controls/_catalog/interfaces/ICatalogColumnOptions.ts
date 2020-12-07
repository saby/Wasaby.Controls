import {ICrud} from 'Types/source';

/**
 * Интерфейс, представляющий общую структуру настройки колонок каталога
 * @interface Controls/_catalog/interfaces/ICatalogColumnOptions
 * @private
 * @author Уфимцев Д.Ю.
 */
export interface ICatalogColumnOptions {
    /**
     * Источник данных для списка, расположенного внутри колонки.
     */
    listSource?: ICrud;

    /**
     * Имя свойства, содержащего информацию об идентификаторе текущей строки.
     */
    keyProperty?: string;

    /**
     * Пользовательский шаблон отображения элемента.
     */
    itemTemplate: String | Function;
}
