import {IHierarchyOptions, ISearchOptions} from 'Controls/interface';
import {IHierarchySearchOptions} from 'Controls/interface/IHierarchySearch';
import {NewSourceController} from 'Controls/dataSource';
import {RecordSet} from 'Types/collection';
import {QueryWhereExpression} from 'Types/source';

type Key = string | number | null;

export interface ISearchControllerOptions extends ISearchOptions,
   IHierarchyOptions,
   IHierarchySearchOptions {
   sourceController?: NewSourceController;
   searchValue?: string;
   root?: Key;
}

/**
 * Интерфейс контроллера поиска {@link Controls/search:ControllerClass}
 *
 * @interface Controls/_search/interface/ISearchController
 * @public
 * @author Крюков Н.Ю.
 */
export default interface ISearchController {
   readonly '[Controls/_search/interface/ISearchController]': boolean;
   reset(dontLoad?: boolean): Promise<RecordSet | Error> | QueryWhereExpression<unknown>;
   search(value: string): Promise<RecordSet | Error>;
   update(options: Partial<ISearchControllerOptions>): void | Promise<RecordSet|Error> | QueryWhereExpression<unknown>;
   setRoot(value: Key): void;
   getRoot(): Key;
   getSearchValue(): string;
}

/**
 * @name Controls/_search/interface/ISearchController#sourceController
 * @cfg {NewSourceController} Экземпляр контроллера источника для выполнения поиска
 */

/**
 * @name Controls/_search/interface/ISearchController#searchValue
 * @cfg {string} Значение по которому будет осуществляться поиск
 */

/**
 * @name Controls/_search/interface/ISearchController#root
 * @cfg {string | number | null} Корень для поиска по иерархии
 */

/**
 * Сброс поиска.
 * Производит очистку фильтра, затем загрузку в sourceController с обновленными параметрами.
 * Если аргумент dontLoad установлен в true, то функция вернет просто фильтр без загрузки.
 * @function Controls/_search/interface/ISearchController#reset
 * @param {boolean} [dontLoad] Производить ли загрузку из источника, или вернуть обновленный фильтр
 */

/**
 * Произвести поиск по значению.
 * @function Controls/_search/interface/ISearchController#search
 * @param {string} value Значение, по которому будет производиться поиск
 */

/**
 * Обновить опции контроллера.
 * Если в новых опциях будет указано отличное от старого searchValue, то будет произведен поиск, или же сброс,
 * если новое значение - пустая строка.
 * @function Controls/_search/interface/ISearchController#update
 * @param {Partial<ISearchControllerOptions>} options Новые опции
 * @example
 * Поиск будет произведен по новому значению searchValue через новый sourceController, которые переданы в опциях.
 * <pre>
 *    searchController.update({
 *       sourceController: new SourceController(...),
 *       searchValue: 'new value'
 *    }).then((result) => {...});
 * </pre>
 * Поиск будет произведен по старому значению searchValue, но посредством нового sourceController
 * <pre>
 *    searchController.update({
 *       sourceController: new SourceController(...)
 *    }).then((result) => {...});
 * </pre>
 */

/**
 * Установить корень для поиска в иерархическом списке.
 * @function Controls/_search/interface/ISearchController#setRoot
 * @param {string|number|null} value Значение корня
 */

/**
 * Получить корень поиска по иерархическому списку.
 * @function Controls/_search/interface/ISearchController#getRoot
 */

/**
 * Получить значение по которому производился поиск
 * @function Controls/_search/interface/ISearchController#getSearchValue
 */
