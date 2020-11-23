import {IControlOptions} from 'UI/Base';
import {IHierarchyOptions, ISearchOptions} from 'Controls/interface';
import {NewSourceController} from 'Controls/dataSource';
import {RecordSet} from 'Types/collection';
import {IHierarchySearchOptions} from 'Controls/interface/IHierarchySearch';
import {QueryWhereExpression} from 'Types/source';

type Key = string | number | null;

/**
 * Интерфейс опций контроллера {@link Controls/search:SearchResolver}
 * @interface Controls/_search/interface#ISearchResolverOptions
 * @public
 * @author Крюков Н.Ю.
 */
export interface ISearchResolverOptions {
   delayTime?: number | null;
   minSearchLength?: number;
   searchCallback: (value: string) => void;
   searchResetCallback: () => void;
}

/**
 * Интерфейс опций контрола контейнера {@link Controls/search:InputContainer}
 * @interface Controls/_search/interface#ISearchInputContainerOptions
 * @extends UI/Base/IControlOptions
 * @public
 * @author Крюков Н.Ю.
 */
export interface ISearchInputContainerOptions extends IControlOptions {
   searchDelay?: number | null;
   minSearchLength?: number;
   inputSearchValue?: string;
   useStore?: boolean;
}

/**
 * Интерфейс опций контроллера поиска {@link Controls/search:ControllerClass}
 * @interface Controls/_search/interface#ISearchControllerOptions
 * @extends Controls/interface/ISearch#ISearchOptions
 * @extends Controls/interface/IHierarchy#IHierarchyOptions
 * @extends Controls/interface/IHierarchy#IHierarchySearchOptions
 * @public
 * @author Крюков Н.Ю.
 */
export interface ISearchControllerOptions extends ISearchOptions,
   IHierarchyOptions,
   IHierarchySearchOptions {
   sourceController: NewSourceController;
   searchValue?: string;
   root?: Key;
}

/**
 * Интерфейс контроллера поиска {@link Controls/search:ControllerClass}
 * @interface Controls/_search/interface#ISearchController
 * @public
 * @author Крюков Н.Ю.
 */
export interface ISearchController {
   reset(needLoadData?: boolean): Promise<RecordSet | Error> | QueryWhereExpression<unknown>;
   search(value: string): Promise<RecordSet|Error>;
   update(options: Partial<ISearchControllerOptions>): void;
   setRoot(value: Key): void;
   getRoot(): Key;
   getSearchValue(): string;
}

/**
 * Интерфейс контроллера {@link Controls/search:SearchResolver}
 * @interface Controls/_search/interface#ISearchResolver
 * @public
 * @author Крюков Н.Ю.
 */
export interface ISearchResolver {
   resolve(value: string | null): void;
   clearTimer(): void;
}
