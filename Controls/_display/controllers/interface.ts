export type TItemKey = string | number;

export interface IBaseCollection<T> {
    getItemBySourceKey(key: TItemKey): T;
    find(predicate: (item: T) => boolean): T;
    nextVersion(): void;
}
