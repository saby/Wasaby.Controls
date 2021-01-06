import {ICrudPlus} from 'Types/source';
import {TemplateFunction} from 'UI/Base';
import {ISourceOptions} from 'Controls/_newBrowser/interfaces/ISourceOptions';

/**
 * Enum со списком доступных вариантов отображения контента в detail-колонке
 */
export enum DetailViewMode {
    // Плоский список
    list = 'list',
    // Плитка
    tile = 'tile',
    // Таблица
    table = 'table',
    // Результаты поиска
    search = 'search'
}

/**
 * Интерфейс описывает структуру настроек detail-колонки компонента {@link Controls/newBrowser:Browser}
 * @interface Controls/newBrowser:IDetailOptions
 * @public
 * @author Уфимцев Д.Ю.
 */
export interface IDetailOptions extends ISourceOptions {
    //region source options
    /**
     * Источник данных, который будет использован списочным представлением внутри detail-колонки.
     * Если не задан, то будет использован источник данных, который указан в основной конфигурации
     * {@link ICatalogOptions.source}
     *
     * @see ICatalogOptions.source
     */
    source?: ICrudPlus;

    /**
     * Имя свойства записи detail-списка, содержащего информацию о её идентификаторе.
     */
    keyProperty?: string;
    //endregion

    //region templates
    /**
     * Кастомный шаблон отображения итема плоского списка.
     *
     * @remark
     * Имеет смысл задавать, если нужно польностью переопределить
     * шаблон итема плоского списка.
     */
    customItemTemplate?: TemplateFunction | string;

    /**
     * Содержимое дефолтного шаблона итема плоского списка.
     *
     * Не применяется если задан {@link customItemTemplate|кастомный шаблон}.
     */
    defaultItemTemplate: {
        /**
         * Шаблон заголовка итема плоского списка.
         */
        captionTemplate: TemplateFunction | string;
        /**
         * Шаблон содержимого итема плоского списка.
         */
        contentTemplate: TemplateFunction | string;
        /**
         * Шаблон подвала итема плоского списка.
         */
        footerTemplate: TemplateFunction | string;
    };

    /**
     * Кастомный шаблон отображения итема плитки
     */
    customTileItemTemplate?: TemplateFunction | string;

    /**
     * Пользовательский шаблон отображения пустого списка.
     */
    emptyTemplate?: TemplateFunction | string;
    //endregion

    /**
     * Название поле записи в котором лежит ссылка на картинку
     */
    imageProperty?: string;

    /**
     * Имя поля записи в котором лежит описание итема и которое
     * нужно вывести в области контента
     */
    descriptionProperty?: string;

    /**
     * Имя поля записи в котором лежит цвет градиента для итема.
     * Можно указывать в любом формате, который поддерживается в CSS.
     */
    gradientColorProperty?: string;

    columns?: unknown;
}
