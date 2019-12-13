import { IViewIterator } from '../Collection';
import { updateCollection, IBaseCollection } from './controllerUtils';
import { EnumeratorCallback } from 'Types/collection';

const CACHE_START_INDEX = 'startIndex';
const CACHE_STOP_INDEX = 'stopIndex';

export interface IVirtualScrollEnumerator {
    setPosition(pos: number): void;
    moveNext(): boolean;
    getCurrentIndex(): number;
    getCurrent(): unknown;
}

export interface IVirtualScrollCollection extends IBaseCollection {
    setViewIterator(viewIterator: IViewIterator): void;
    getCount(): number;
    getEnumerator(): IVirtualScrollEnumerator;
}

export function setup(collection: IVirtualScrollCollection): void {
    updateCollection(collection, () => {
        collection.setViewIterator({
            each: each.bind(null, collection),
            setIndices: setIndices.bind(null, collection),
            isItemAtIndexHidden: () => false
        });
    });
}

export function setIndices(
    collection: IVirtualScrollCollection,
    startIndex: number,
    stopIndex: number
): boolean {
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

export function each(
    collection: IVirtualScrollCollection,
    callback: EnumeratorCallback<unknown>,
    context?: object
): void {
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

export function getStartIndex(collection: IVirtualScrollCollection): number {
    return (collection.getCacheValue(CACHE_START_INDEX) as number) || 0;
}

export function getStopIndex(collection: IVirtualScrollCollection): number {
    return (
        (collection.getCacheValue(CACHE_STOP_INDEX) as number) ||
        collection.getCount()
    );
}
