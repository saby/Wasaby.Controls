import {IControlOptions} from 'UI/Base';
import {IHierarchyOptions, ISearchOptions} from 'Controls/interface';
import {NewSourceController} from 'Controls/dataSource';
import {IHierarchySearchOptions} from 'Controls/interface/IHierarchySearch';

type Key = string | number | null;

/**
 * Интерфейс опций контроллера {@link Controls/search:SearchResolver}
 * @interface Controls/_search/interface/ISearchResolver
 * @public
 * @author Крюков Н.Ю.
 */
export interface ISearchResolverOptions {

   /**
    * @cfg {number|null} Время задержки перед поиском
    */
   searchDelay?: number | null;

   /**
    * @cfg {number} Минимальная длина значения для начала поиска
    */
   minSearchLength?: number;

   /**
    * @cfg {Function} Функция, которая будет вызвана если поиск будет разрешен
    */
   searchCallback: (value: string) => void;

   /**
    * @cfg {Function} Функция, которая будет вызвана если поиск был сброшен
    */
   searchResetCallback: () => void;
}

/**
 * Интерфейс опций контрола контейнера {@link Controls/search:InputContainer}
 * @interface Controls/_search/interface/ISearchInputContainer
 * @extends UI/Base/IControlOptions
 * @public
 * @author Крюков Н.Ю.
 */
export interface ISearchInputContainerOptions extends IControlOptions {
   /**
    * @cfg {number|null} Время задержки перед поиском
    * @demo Controls-demo/Search/Explorer/Index
    * @demo Controls-demo/Search/FlatList/Index
    * @demo Controls-demo/Search/TreeView/Index
    */
   searchDelay?: number | null;

   /**
    * @cfg {number} Минимальная длина значения для начала поиска
    * @demo Controls-demo/Search/Explorer/Index
    * @demo Controls-demo/Search/FlatList/Index
    * @demo Controls-demo/Search/TreeView/Index
    */
   minSearchLength?: number;

   /**
    * @cfg {string} Значение строки ввода
    * @demo Controls-demo/Search/Explorer/Index
    * @demo Controls-demo/Search/FlatList/Index
    * @demo Controls-demo/Search/TreeView/Index
    */
   inputSearchValue?: string;

   /**
    * @cfg {boolean} Использовать ли хранилище Store вместо отправки события при разрешении на поиск
    * @demo Controls-demo/Search/Explorer/Index
    * @demo Controls-demo/Search/FlatList/Index
    * @demo Controls-demo/Search/TreeView/Index
    */
   useStore?: boolean;
}

/**
 * Интерфейс опций контроллера поиска {@link Controls/search:ControllerClass}
 *
 * @interface Controls/_search/interface/ISearchController
 * @extends Controls/interface/ISearch#ISearchOptions
 * @extends Controls/interface/IHierarchy#IHierarchyOptions
 * @extends Controls/interface/IHierarchy#IHierarchySearchOptions
 * @public
 * @author Крюков Н.Ю.
 */
export interface ISearchControllerOptions extends ISearchOptions,
   IHierarchyOptions,
   IHierarchySearchOptions {
   /**
    * @cfg {NewSourceController} Экземпляр источника для выполнения поиска
    */
   sourceController?: NewSourceController;

   /**
    * @cfg {string} Значение по которому будет осуществляться поиск
    */
   searchValue?: string;

   /**
    * @cfg {string | number | null} Корень для поиска по иерархии
    */
   root?: Key;
}
