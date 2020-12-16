export interface ISearchResolverOptions {
   searchDelay?: number | null;
   minSearchLength?: number;
   searchCallback: (value: string) => void;
   searchResetCallback: () => void;
}

/**
 * Интерфейс контроллера {@link Controls/search:SearchResolver}
 * @interface Controls/_search/interface/ISearchResolver
 * @public
 * @author Крюков Н.Ю.
 */
export default interface ISearchResolver {
   readonly '[Controls/_search/interface/ISearchResolver]': boolean;
   updateOptions(options: ISearchResolverOptions): void;
   clearTimer(): void;
   resolve(value: string | null): void;
   setSearchStarted(value: boolean): void;
}

/**
 * @name Controls/_search/interface/ISearchResolver#searchDelay
 * @cfg {number|null} Время задержки перед поиском
 */

/**
 * @name Controls/_search/interface/ISearchResolver#minSearchLength
 * @cfg {number} Минимальная длина значения для начала поиска
 */

/**
 * @name Controls/_search/interface/ISearchResolver#searchCallback
 * @cfg {Function} Функция, начала поиска
 */

/**
 * @name Controls/_search/interface/ISearchResolver#searchResetCallback
 * @cfg {Function} Функция, которая будет вызвана если поиск был сброшен
 */

/**
 * Обновляет опции контроллера
 * @function Controls/_search/interface/ISearchResolver#updateOptions
 * @param {ISearchResolverOptions} options Новые опции контроллера
 */

/**
 * Очищает таймер реализующий задержку перед поиском
 * @function Controls/_search/interface/ISearchResolver#clearTimer
 */

/**
 * Инициировать проверку, какое действие предпринять по полученному через аргумент значению поиска
 * @function Controls/_search/interface/ISearchResolver#resolve
 * @param {string|null} value Значение, по которому должен произзводиться поиск
 */

/**
 * Устанавливает флаг начала поиска на переданное в аргументе значение
 * @function Controls/_search/interface/ISearchResolver#setSearchStarted
 * @param {boolean} value Флаг начала поиска
 */
