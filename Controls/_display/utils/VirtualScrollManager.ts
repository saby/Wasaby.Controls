import Collection from '../Collection';
import { EnumeratorCallback } from 'Types/collection';

export default class VirtualScrollManager {
    private _owner: Collection<unknown>;

    constructor(owner: Collection<unknown>) {
        this._owner = owner;
    }

    each(callback: EnumeratorCallback<unknown>, context?: object): void {
        const startIndex = this._owner.getStartIndex();
        const stopIndex = this._owner.getStopIndex(), this._owner.getCount();
        const enumerator = this._owner.getEnumerator();

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
