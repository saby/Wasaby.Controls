import { assert } from 'chai';

import EditInPlaceManager from 'Controls/_display/utils/EditInPlaceManager';
import { CollectionItem } from 'Controls/display';

describe('Controls/_display/utils/EditInPlaceManager', () => {
    let collection;
    let manager: EditInPlaceManager;

    beforeEach(() => {
        collection = {};
        manager = new EditInPlaceManager(collection);
    });

    describe('.beginEdit()', () => {
        it('is not editing currently', () => {
            const item = new CollectionItem();
            const editingContents = {};

            manager.beginEdit(item, editingContents);

            assert.isTrue(item.isEditing());
            assert.strictEqual(item.getContents(), editingContents);
        });

        it('is editing currently', () => {
            const item = new CollectionItem();

            manager.beginEdit(item);

            const newItem = new CollectionItem();

            manager.beginEdit(newItem);

            assert.isTrue(newItem.isEditing());
            assert.isFalse(item.isEditing());
        });
    });

    it('.endEdit()', () => {
        const contents = { _actual: true };
        const item = new CollectionItem({ contents });

        manager.beginEdit(item, { _editing: true });
        manager.endEdit();

        assert.isFalse(item.isEditing());
        assert.strictEqual(item.getContents(), contents);
    });

    it('.isEditing()', () => {
        assert.isFalse(manager.isEditing());

        const item = new CollectionItem();
        manager.beginEdit(item);

        assert.isTrue(manager.isEditing());

        manager.endEdit();
        assert.isFalse(manager.isEditing());
    });
});
