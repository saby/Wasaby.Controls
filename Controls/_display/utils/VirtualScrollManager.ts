import BaseManager from './BaseManager';
import { EnumeratorCallback } from 'Types/collection';

export interface IVirtualScrollEnumerator {
    setPosition(position: number): void;
    moveNext(): boolean;
    getCurrentIndex(): number;
    getCurrent(): unknown;
}

export interface IVirtualScrollManageableCollection {
    getStartIndex(): number;
    getStopIndex(): number;
    getEnumerator(): IVirtualScrollEnumerator;
}

export default class VirtualScrollManager extends BaseManager<IVirtualScrollManageableCollection> {
    each(callback: EnumeratorCallback<unknown>, context?: object): void {
        const startIndex = this._collection.getStartIndex();
        const stopIndex = this._collection.getStopIndex();
        const enumerator = this._collection.getEnumerator();

        enumerator.setPosition(startIndex - 1);

        while (enumerator.moveNext() && enumerator.getCurrentIndex() < stopIndex) {
            callback.call(
                context,
                enumerator.getCurrent(),
                enumerator.getCurrentIndex()
            );
        }
    }
}
