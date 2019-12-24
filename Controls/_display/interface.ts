import IItemsStrategy from 'Types/_display/IItemsStrategy';

export type TItemKey = string | number;

export interface IBaseCollection<T> {
    getItemBySourceKey(key: TItemKey): T;
    find(predicate: (item: T) => boolean): T;
    getNext(item: T): T;
    getPrevious(item: T): T;
    nextVersion(): void;
}

export interface IStrategyCollection<T> {
    appendStrategy(strategy: Function, options?: object): void;
    removeStrategy(strategy: Function): void;
}

export interface ICollectionCommand<T> {
    execute(collection: IBaseCollection<T>): void;
}
