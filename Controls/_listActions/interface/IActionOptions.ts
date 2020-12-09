import {ICrud, CrudEntityKey} from 'Types/source';
import {INavigationOptionValue} from 'Controls/interface';
import {IColumn} from 'Controls/grid';
import {RecordSet} from 'Types/collection';

/**
 * Интерфейс стандартного набора опций для действия над записью
 * @interface Controls/_listActions/interface/IActionOptions
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
        selected: CrudEntityKey[];
        excluded: CrudEntityKey[];
    };
    items: RecordSet;
    target?: HTMLElement;
}

/**
 * @typedef {Object} ISelection
 * @description Выборка записей
 * @property {Array<Types/source:CrudEntityKey>} selected Массив ключей выбранных записей
 * @property {Array<Types/source:CrudEntityKey>} excluded Массив ключей исключенных записей
 */

/**
 * @name Controls/_listActions/interface/IActionOptions#source
 * @cfg {Types/source:ICrud} Источник записи
 */

/**
 * @name Controls/_listActions/interface/IActionOptions#filter
 * @cfg {object} Текущая фильтрация
 */

/**
 * @name Controls/_listActions/interface/IActionOptions#navigation
 * @cfg {Controls/interface:INavigationOptionValue} Навигация для источника данных
 */

/**
 * @name Controls/_listActions/interface/IActionOptions#sorting
 * @cfg {object} Сортировка для источника данных
 */

/**
 * @name Controls/_listActions/interface/IActionOptions#parentProperty
 * @cfg {string} Название поля иерархии
 */

/**
 * @name Controls/_listActions/interface/IActionOptions#columns
 * @cfg {Array<Controls/grid:IColumn>} Конфигурация колонок
 */

/**
 * @name Controls/_listActions/interface/IActionOptions#selection
 * @cfg {ISelection} Объект выборки
 */

/**
 * @name Controls/_listActions/interface/IActionOptions#items
 * @cfg {Types/collection:RecordSet} Коллекция отображаемых записей
 */