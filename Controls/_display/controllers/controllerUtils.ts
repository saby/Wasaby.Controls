import Collection from '../Collection';

export function getItemByKey<T>(collection: Collection<unknown>, key: string|number): T {
    if (key !== undefined && key !== null) {
        return collection.getItemBySourceId(key) as unknown as T;
    } else {
        return null;
    }
}

export function updateCollection(collection: Collection<unknown>, transaction: () => void): void {
    transaction();
    collection.nextVersion();
}

export function updateCollectionWithCachedItem<T>(
    collection: Collection<unknown>,
    cacheKey: string,
    transaction: (oldCacheValue: T) => T
): void {
    updateCollection(collection, () => {
        const oldCacheValue: T = collection.getCacheValue(cacheKey);
        const newCacheValue: T = transaction(oldCacheValue);
        collection.setCacheValue(cacheKey, newCacheValue);
    });
}
