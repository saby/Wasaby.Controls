import { Flags as FlagsDisplay } from 'Controls/display';
import { Flags as FlagsType } from 'Types/collection';

import * as coreInstance from 'Core/core-instance';

describe('Controls/_display/Flags', () => {
    let dict: string[];
    let collection: FlagsType<string>;
    let display: FlagsDisplay<string>;

    beforeEach(() => {
        dict = ['one', 'two', 'three'];

        collection = new FlagsType({
            dictionary: dict
        });

        display = new FlagsDisplay({
            collection
        });
    });

    afterEach(() => {
        dict = undefined;

        display.destroy();
        display = undefined;

        collection.destroy();
        collection = undefined;
    });

    describe('.constructor()', () => {
        it('should throw an error for not IFlags', () => {
            let display;

            assert.throws(() => {
                display = new FlagsDisplay({
                    collection: []
                });
            });
            assert.throws(() => {
                display = new FlagsDisplay({
                    collection: {}
                });
            });
            assert.throws(() => {
                display = new FlagsDisplay({
                    collection: null
                });
            });
            assert.throws(() => {
                display = new FlagsDisplay();
            });

            assert.isUndefined(display);
        });

        it('should take selection from the Flags', () => {
            display.each((item) => {
                assert.strictEqual(item.isSelected(), collection.get(item.getContents()));
            });

            collection.set('one', true);
            const displayToo = new FlagsDisplay({
                collection
            });
            displayToo.each((item) => {
                assert.strictEqual(item.isSelected(), collection.get(item.getContents() as any));
            });
        });
    });

    describe('.each()', () => {
        it('should return FlagsItem', () => {
            display.each((item) => {
                assert.isTrue(coreInstance.instanceOfModule(item, 'Controls/_display/FlagsItem'));
            });
        });
    });

    describe('.subscribe()', () => {
        it('should trigger "onCollectionChange" if flag changed', () => {
            const given: any = {};
            const handler = (event, action, newItems, newItemsIndex) => {
                given.item = newItems[0];
                given.index = newItemsIndex;
            };

            display.subscribe('onCollectionChange', handler);
            collection.set('one', true);
            display.unsubscribe('onCollectionChange', handler);

            assert.strictEqual(given.item.getContents(), 'one');
            assert.strictEqual(given.index, 0);
        });

        it('should trigger "onCollectionChange" if all flags changed', () => {
            const given: any = [];
            const handler = (event, action, items, index) => {
                given.push({
                    action,
                    items,
                    index
                });
            };

            display.subscribe('onCollectionChange', handler);
            collection.fromArray([true, true, true]);
            display.unsubscribe('onCollectionChange', handler);

            const expected = [{
                action: 'ch',
                items: [display.at(0)],
                index: 0
            }, {
                action: 'ch',
                items: [display.at(1)],
                index: 1
            }, {
                action: 'ch',
                items: [display.at(2)],
                index: 2
            }];
            assert.deepEqual(given, expected);
        });
    });

    it('should trigger "onCollectionChange" if flag with string index changed', () => {
        const dict = {1: 'one', 2: 'two', 3: 'three'};

        const collection = new FlagsType({
            dictionary: dict
        });

        const display = new FlagsDisplay({
            collection
        });

        const given: any = {};
        const handler = (event, action, newItems, newItemsIndex) => {
            given.item = newItems[0];
            given.index = newItemsIndex;
        };

        display.subscribe('onCollectionChange', handler);
        collection.set('two', true);
        display.unsubscribe('onCollectionChange', handler);

        assert.strictEqual(given.item.getContents(), 'two');
        assert.strictEqual(given.index, 1);
    });
});
