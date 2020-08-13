import IItemsStrategy from './IItemsStrategy';
import CollectionItem from './CollectionItem';
import {ICollection} from "./interface/ICollection";

export type TItemKey = string | number;

export interface ICollectionItem<T> {
    getContents(): T;
    getOwner(): ICollection<T, ICollectionItem<T>>;
    setOwner(owner: ICollection<T, ICollectionItem<T>>): void;
    getUid(): string;
    setContents?(contents: T, silent?: boolean): void
}

export interface IBaseCollection<S, T extends ICollectionItem<S>> {
    each(cb: (item: T) => void): void;
    getItemBySourceKey(key: TItemKey): T;
    getCount(): number;
    find(predicate: (item: T) => boolean): T;
    getItemBySourceItem?(item: S): T;
    getNext(item: T): T;
    getPrevious(item: T): T;
    nextVersion(): void;
}

export interface IStrategyCollection<T> {
    appendStrategy(strategy: Function, options?: object): void;
    getStrategyInstance(strategy: Function): IItemsStrategy<unknown, T>;
    removeStrategy(strategy: Function): void;
}
