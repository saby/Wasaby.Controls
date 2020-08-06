import { assert } from 'chai';

import { Flags as FlagsDisplay } from 'Controls/display';
import { Flags as FlagsType } from 'Types/collection';

describe('Controls/_display/FlagsItem', () => {
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

    describe('.isSelected()', () => {
        it('should return value from the Flags', () => {
            collection.set('two', true);
            collection.set('three', false);

            display.each((item) => {
                assert.strictEqual(
                    item.isSelected(),
                    collection.get(item.getContents())
                );
            });
        });

        it('should return value from localized Flags', () => {
            const dict = ['one', 'two', 'three'];
            const localeDict = ['uno', 'dos', 'tres'];
            const expected = [true, false, true];

            collection = new FlagsType({
                dictionary: dict,
                localeDictionary: localeDict,
                values: expected
            });

            const display = new FlagsDisplay({
                collection
            });

            display.each((item, index) => {
                assert.strictEqual(
                    item.isSelected(),
                    expected[index]
                );
            });
        });
    });

    describe('.setSelected()', () => {
        it('should translate value to the Flags', () => {
            const values = [true, false, null];

            display.each((item, index) => {
                item.setSelected(values[index]);

                assert.strictEqual(
                    item.isSelected(),
                    values[index]
                );

                assert.strictEqual(
                    collection.get(item.getContents()),
                    values[index]
                );
            });
        });

        it('should translate localized value to the Flags', () => {
            const dict = ['one', 'two', 'three'];
            const localeDict = ['uno', 'dos', 'tres'];
            const values = [true, false, null];

            collection = new FlagsType({
                dictionary: dict,
                localeDictionary: localeDict
            });

            const display = new FlagsDisplay({
                collection
            });

            display.each((item, index) => {
                item.setSelected(values[index]);

                assert.strictEqual(
                    item.isSelected(),
                    values[index]
                );

                assert.strictEqual(
                    collection.get(item.getContents() as any, true),
                    values[index]
                );
            });
        });
    });
});
