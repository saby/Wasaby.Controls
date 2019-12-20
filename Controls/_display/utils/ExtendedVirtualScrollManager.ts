import BaseManager from './VirtualScrollManager';
import { EnumeratorCallback } from 'Types/collection';

export default class VirtualScrollManager extends BaseManager {
    isItemVisible = (index: number): boolean => {
        return index >= this._collection.getStartIndex() && index < this._collection.getStopIndex();
    }

    /**
     * Применяет флаг того, что элемент был хоть раз отрисован
     * @remark Необходимо применять этот флаг, для того чтобы отображать все элементы, которые хоть раз были отрисованы,
     * даже если они не находятся в пределах startindex и stopindex
     * @param {number} startIndex
     * @param {number} stopIndex
     */
    applyRenderedItems(startIndex: number, stopIndex: number): void {
        for (let i = startIndex; i < stopIndex; i++) {
            this._collection.at(i).setRendered(true);
        }
    }

    each(callback: EnumeratorCallback<unknown>, context?: object): void {
        const enumerator = this._collection.getEnumerator();

        enumerator.setPosition(-1);

        while (enumerator.moveNext()) {
            if (enumerator.getCurrent().isRendered()) {
                callback.call(
                    context,
                    enumerator.getCurrent(),
                    enumerator.getCurrentIndex()
                );
            }
        }
    }
}
