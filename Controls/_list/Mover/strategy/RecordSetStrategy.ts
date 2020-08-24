import { RecordSet } from 'Types/collection';
import { IMoveStrategy } from '../interface/IMoveStrategy';

export class RecordSetStrategy implements IMoveStrategy<RecordSet> {
    moveItems(items: RecordSet, target, position): Promise<any> {
        const self = this;
        return _private.getItemsBySelection.call(this, items).addCallback(function (items) {
            items = items.filter((item) => {
                return _private.checkItem(self, item, target, position);
            });
            if (items.length) {
                return _private.moveItems(self, items, target, position);
            } else {
                return Deferred.success();
            }
        });
    }
}
