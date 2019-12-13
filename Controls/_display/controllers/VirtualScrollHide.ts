import Collection from '../Collection';
import * as VirtualScroll from './VirtualScroll';
import { updateCollection } from './controllerUtils';
import { EnumeratorCallback } from 'Types/collection';

export function setup(collection: Collection<unknown>): void {
    updateCollection(collection, () => {
        collection.setViewIterator({
            each: each.bind(null, collection),
            setIndices: setIndices.bind(null, collection),
            isItemAtIndexHidden: isItemAtIndexHidden.bind(null, collection)
        });
    });
}

export function setIndices(collection: Collection<unknown>, startIndex: number, stopIndex: number): boolean {
    const indicesChanged = VirtualScroll.setIndices(collection, startIndex, stopIndex);
    if (indicesChanged) {
        updateCollection(collection, () => {
            const setStart = VirtualScroll.getStartIndex(collection);
            const setStop = VirtualScroll.getStopIndex(collection);
            for (let i = setStart; i < setStop; i++) {
                collection.at(i).setRendered(true);
            }
        });
    }
    return indicesChanged;
}

export function each(collection: Collection<unknown>, callback: EnumeratorCallback<unknown>, context?: object): void {
    const enumerator = collection.getEnumerator();

    enumerator.setPosition(-1);

    while (enumerator.moveNext()) {
        const item = enumerator.getCurrent();
        if (item.isRendered()) {
            callback.call(
                context,
                item,
                enumerator.getCurrentIndex()
            );
        }
    }
}

export function isItemAtIndexHidden(collection: Collection<unknown>, index: number): boolean {
    return index < VirtualScroll.getStartIndex(collection) || index >= VirtualScroll.getStopIndex(collection);
}
