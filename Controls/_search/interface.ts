import {IControlOptions} from 'UI/Base';
import {IHierarchyOptions, ISearchOptions} from 'Controls/interface';
import {NewSourceController} from 'Controls/dataSource';
import {RecordSet} from 'Types/collection';
import {IHierarchySearchOptions} from 'Controls/interface/IHierarchySearch';

type Key = string | number | null;

export interface ISearchResolverOptions {
   delayTime?: number | null;
   minSearchLength?: number;
   searchCallback: (value: string) => void;
   searchResetCallback: () => void;
}

export interface ISearchInputContainerOptions extends IControlOptions {
   delayTime?: number | null;
   minSearchValueLength?: number;
}

export interface ISearchControllerOptions extends ISearchOptions,
   IHierarchyOptions,
   IHierarchySearchOptions {
   sourceController: NewSourceController;
   searchValue?: string;
   root?: Key;
}

export interface ISearchController {
   reset(): Promise<RecordSet>;
   search(value: string): Promise<RecordSet>;
   update(options: Partial<ISearchControllerOptions>): void;
   setRoot(value: Key): void;
   getRoot(): Key;
}

export interface ISearchResolver {
   resolve(value: string | null): void;
   clearTimer(): void;
}
