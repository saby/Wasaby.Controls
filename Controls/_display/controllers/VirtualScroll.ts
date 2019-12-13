import Collection from '../Collection';
import { updateCollection } from './controllerUtils';
import { EnumeratorCallback } from 'Types/collection';

const CACHE_START_INDEX = 'startIndex';
const CACHE_STOP_INDEX = 'stopIndex';

export function setup(collection: Collection<unknown>): void {
    updateCollection(collection, () => {
        collection.setViewIterator({
            each: each.bind(null, collection),
            setIndices: setIndices.bind(null, collection),
            isItemAtIndexHidden: () => false
        });
    });
}

export function setIndices(collection: Collection<unknown>, startIndex: number, stopIndex: number): boolean {
    const oldStart = getStartIndex(collection);
    const oldStop = getStopIndex(collection);

    const newStart = Math.max(startIndex, 0);
    const newStop = Math.min(stopIndex, collection.getCount());

    if (newStart !== oldStart || newStop !== oldStop) {
        updateCollection(collection, () => {
            collection.setCacheValue(CACHE_START_INDEX, newStart);
            collection.setCacheValue(CACHE_STOP_INDEX, newStop);
        });
        return true;
    }

    return false;
}

export function each(collection: Collection<unknown>, callback: EnumeratorCallback<unknown>, context?: object): void {
    const startIndex = getStartIndex(collection);
    const stopIndex = getStopIndex(collection);
    const enumerator = collection.getEnumerator();

    enumerator.setPosition(startIndex - 1);

    while (enumerator.moveNext() && enumerator.getCurrentIndex() < stopIndex) {
        callback.call(
            context,
            enumerator.getCurrent(),
            enumerator.getCurrentIndex()
        );
    }
}

export function getStartIndex(collection: Collection<unknown>): number {
    return collection.getCacheValue(CACHE_START_INDEX) || 0;
}

export function getStopIndex(collection: Collection<unknown>): number {
    return collection.getCacheValue(CACHE_STOP_INDEX) || collection.getCount();
}
