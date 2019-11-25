import { CollectionItem } from 'Controls/display';

interface IChangedData<T> {
    item?: CollectionItem<T>;
    property?: string;
}

describe('Controls/_display/CollectionItem', () => {
    describe('.getOwner()', () => {
        it('should return null by default', () => {
            const item = new CollectionItem();
            assert.isNull(item.getOwner());
        });

        it('should return value passed to the constructor', () => {
            const owner = {};
            const item = new CollectionItem({owner: owner as any});

            assert.strictEqual(item.getOwner(), owner);
        });
    });

    describe('.setOwner()', () => {
        it('should set the new value', () => {
            const owner = {};
            const item = new CollectionItem();

            item.setOwner(owner as any);

            assert.strictEqual(item.getOwner(), owner);
        });
    });

    describe('.getContents()', () => {
        it('should return null by default', () => {
            const item = new CollectionItem();
            assert.isNull(item.getContents());
        });

        it('should return value passed to the constructor', () => {
            const contents = {};
            const item = new CollectionItem({contents});

            assert.strictEqual(item.getContents(), contents);
        });
    });

    describe('.setContents()', () => {
        it('should set the new value', () => {
            const contents = {};
            const item = new CollectionItem();

            item.setContents(contents);

            assert.strictEqual(item.getContents(), contents);
        });

        it('should notify the owner', () => {
            const newContents = 'new';
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                }
            };
            const item = new CollectionItem({owner: owner as any});

            item.setContents(newContents);

            assert.strictEqual(given.item, item);
            assert.strictEqual(given.property, 'contents');
        });

        it('should not notify the owner', () => {
            const newContents = 'new';
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                }
            };
            const item = new CollectionItem({owner: owner as any});

            item.setContents(newContents, true);

            assert.isUndefined(given.item);
            assert.isUndefined(given.property);
        });
    });

    describe('.getUid()', () => {
        it('should return calling result of getItemUid() on owner', () => {
            const owner = {
                getItemUid: (item) => `[${item.getContents()}]`
            };
            const item = new CollectionItem({
                owner: owner as any,
                contents: 'foo'
            });

            assert.equal(item.getUid(), '[foo]');
        });

        it('should return undefined if there is no owner', () => {
            const item = new CollectionItem();
            assert.isUndefined(item.getUid());
        });
    });

    describe('.isSelected()', () => {
        it('should return false by default', () => {
            const item = new CollectionItem();
            assert.isFalse(item.isSelected());
        });

        it('should return value passed to the constructor', () => {
            const selected = true;
            const item = new CollectionItem({selected});

            assert.strictEqual(item.isSelected(), selected);
        });
    });

    describe('.setSelected()', () => {
        it('should set the new value', () => {
            const selected = true;
            const item = new CollectionItem();

            item.setSelected(selected);

            assert.strictEqual(item.isSelected(), selected);
        });

        it('should notify the owner', () => {
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                }
            };

            const item = new CollectionItem({owner: owner as any});
            item.setSelected(true);

            assert.strictEqual(given.item, item);
            assert.strictEqual(given.property, 'selected');
        });

        it('should not notify the owner', () => {
            const given: IChangedData<string> = {};
            const owner = {
                notifyItemChange(item: CollectionItem<string>, property: string): void {
                    given.item = item;
                    given.property = property;
                }
            };

            const item = new CollectionItem({owner: owner as any});
            item.setSelected(true, true);

            assert.isUndefined(given.item);
            assert.isUndefined(given.property);
        });
    });

    describe('.toJSON()', () => {
        it('should serialize the collection item', () => {
            const item = new CollectionItem();
            const json = item.toJSON();
            const options = (item as any)._getOptions();

            delete options.owner;

            assert.strictEqual(json.module, 'Controls/display:CollectionItem');
            assert.isNumber(json.id);
            assert.isTrue(json.id > 0);
            assert.deepEqual(json.state.$options, options);
            assert.strictEqual((json.state as any).iid, item.getInstanceId());
        });

        it('should serialize contents of the item if owner is not defined', () => {
            const items = [1];
            (items as any).getIndex = Array.prototype.indexOf;
            const owner = {
                getCollection(): number[] {
                    return items;
                }
            };

            const item = new CollectionItem({
                owner: owner as any,
                contents: 'foo'
            });
            const json = item.toJSON();

            assert.isUndefined((json.state as any).ci);
            assert.equal(json.state.$options.contents, 'foo');
        });

        it('should serialize contents of the item if owner doesn\'t supports IList', () => {
            const items = [1];
            const owner = {
                getCollection(): number[] {
                    return items;
                }
            };

            const item = new CollectionItem({
                owner: owner as any,
                contents: 'foo'
            });
            const json = item.toJSON();

            assert.isUndefined((json.state as any).ci);
            assert.equal(json.state.$options.contents, 'foo');
        });

        it('should don\'t serialize contents of the item if owner supports IList', () => {
            const items = [1];
            const owner = {
                getCollection(): number[] {
                    return items;
                }
            };
            items['[Types/_collection/IList]'] = true;
            (items as any).getIndex = Array.prototype.indexOf;

            const item = new CollectionItem({
                owner: owner as any,
                contents: items[0]
            });
            const json = item.toJSON();

            assert.strictEqual((json.state as any).ci, 0);
            assert.isUndefined(json.state.$options.contents);
        });
    });
});
