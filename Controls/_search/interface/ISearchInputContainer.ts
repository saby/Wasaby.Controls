import {IControlOptions} from 'UI/Base';

export interface ISearchInputContainerOptions extends IControlOptions {
   searchDelay?: number | null;
   minSearchLength?: number;
   inputSearchValue?: string;
   useStore?: boolean;
}

/**
 * Интерфейс контрола-контейнера {@link Controls/search:InputContainer}
 * @interface Controls/_search/interface/ISearchInputContainer
 * @public
 * @author Крюков Н.Ю.
 */
export default interface ISearchInputContainer {
   readonly '[Controls/_search/interface/ISearchInputContainer]': boolean;
}

/**
 * @name Controls/_search/interface/ISearchInputContainer#searchDelay
 * @cfg {number|null} Время задержки перед поиском
 * @demo Controls-demo/Search/Explorer/Index
 * @demo Controls-demo/Search/FlatList/Index
 * @demo Controls-demo/Search/TreeView/Index
 */

/**
 * @name Controls/_search/interface/ISearchInputContainer#minSearchLength
 * @cfg {number} Минимальная длина значения для начала поиска
 * @demo Controls-demo/Search/Explorer/Index
 * @demo Controls-demo/Search/FlatList/Index
 * @demo Controls-demo/Search/TreeView/Index
 */

/**
 * @name Controls/_search/interface/ISearchInputContainer#inputSearchValue
 * @cfg {string} Значение строки ввода
 * @demo Controls-demo/Search/Explorer/Index
 * @demo Controls-demo/Search/FlatList/Index
 * @demo Controls-demo/Search/TreeView/Index
 */

/**
 * @name Controls/_search/interface/ISearchInputContainer#useStore
 * @cfg {boolean} Использовать ли хранилище Store вместо отправки события при разрешении на поиск
 * @demo Controls-demo/Search/Explorer/Index
 * @demo Controls-demo/Search/FlatList/Index
 * @demo Controls-demo/Search/TreeView/Index
 */

/**
 * @event Происходит при начале поиска
 * @name Controls/_search/Input/Container#search
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {value} string Значение по которому производится поиск.
 */

/**
 * @event Происходит при сбросе поиска
 * @name Controls/_search/Input/Container#resetSearch
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 */
