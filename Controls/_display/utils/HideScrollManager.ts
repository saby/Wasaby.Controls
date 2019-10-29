import BaseManager from './BaseManager';
import { EnumeratorCallback } from 'Types/collection';
import CollectionItem from '../CollectionItem';

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
    getSourceIndexByIndex(): number;
    at(index: number): CollectionItem<uknown>;
}

export default class VirtualScrollManager extends BaseManager<IVirtualScrollManageableCollection> {
    private _rendered: Record<string, boolean> = {};

    applyRenderedItems(startIndex: number, stopIndex: number) {
        for (let i = startIndex; i <= stopIndex; i++) {
            this._rendered[this._collection.at(i).getUid()] = true;
        }
    }

    reset(): void {
        this._rendered = {};
    }

    each(callback: EnumeratorCallback<unknown>, context?: object): void {
        const enumerator = this._collection.getEnumerator();

        enumerator.setPosition(-1);

        while (enumerator.moveNext()) {
            if (this._rendered[enumerator.getCurrent().getUid()]) {
                callback.call(
                    context,
                    enumerator.getCurrent(),
                    enumerator.getCurrentIndex()
                );
            }
        }
    }
}
