export type TCollectionKey = string | number;

export interface IBaseCollection {
    getItemBySourceId(key: TCollectionKey): unknown;
    nextVersion(): void;
    getCacheValue(cacheKey: string): unknown;
    setCacheValue(cacheKey: string, value: unknown): void;
}

export function getItemByKey<T>(
    collection: IBaseCollection,
    key: TCollectionKey
): T {
    if (key !== undefined && key !== null) {
        return collection.getItemBySourceId(key) as T;
    } else {
        return null;
    }
}

export function updateCollection(
    collection: IBaseCollection,
    transaction: () => void
): void {
    transaction();
    collection.nextVersion();
}

export function updateCollectionWithCachedItem<T>(
    collection: IBaseCollection,
    cacheKey: string,
    transaction: (oldCacheValue: T) => T
): void {
    updateCollection(collection, () => {
        const oldCacheValue = collection.getCacheValue(cacheKey) as T;
        const newCacheValue = transaction(oldCacheValue) as T;
        collection.setCacheValue(cacheKey, newCacheValue);
    });
}
