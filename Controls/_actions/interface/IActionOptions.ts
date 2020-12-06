import {ICrud} from 'Types/source';
import {INavigationOptionValue} from 'Controls/interface';
import {IColumn} from 'Controls/grid';
import {Collection} from 'Controls/display';
import {Model} from 'Types/entity';

/**
 * Интерфейс стандартного набора опций для действия над записью
 * @interface Controls/_actions/interface/IActionOptions
 * @public
 * @author Крайнов Д.О.
 */
export default interface IActionOptions {
    source: ICrud;
    filter: object;
    navigation?: INavigationOptionValue<unknown>;
    sorting?: unknown;
    parentProperty?: string;
    columns?: IColumn[];
    selection: {
        selected: string[];
        excluded: string[];
    };
    items: Collection<Model>;
    target?: HTMLElement;
}

/**
 * @name Controls/_actions/interface/IActionOptions#source
 * @cfg {ICrud} Источник записи
 */

/**
 * @name Controls/_actions/interface/IActionOptions#filter
 * @cfg {object} Текущая фильтрация
 */

/**
 * @name Controls/_actions/interface/IActionOptions#navigation
 * @cfg {object} Навигация для источника данных
 */

/**
 * @name Controls/_actions/interface/IActionOptions#sorting
 * @cfg {object} Сортировка для источника данных
 */

/**
 * @name Controls/_actions/interface/IActionOptions#parentProperty
 * @cfg {string} Название поля иерархии
 */

/**
 * @name Controls/_actions/interface/IActionOptions#columns
 * @cfg {IColumn[]} Конфигурация колонок
 */

/**
 * @name Controls/_actions/interface/IActionOptions#selection
 * @cfg {object} Объект выборки
 */

/**
 * @name Controls/_actions/interface/IActionOptions#items
 * @cfg {object} Коллекция отображаемых записей
 */
