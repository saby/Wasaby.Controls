import { Enum as EnumDisplay } from 'Controls/display';
import { Enum as EnumType } from 'Types/collection';

describe('Controls/_display/Enum', () => {
    let dict: string[];
    let localeDict: string[];
    let collection: EnumType<string>;
    let display: EnumDisplay<string>;
    let holeyDict: {
       [key: string]: string;
    };
    let holeyCollection: EnumType<string>;
    let holeyDisplay: EnumDisplay<string>;

    beforeEach(() => {
        dict = ['one', 'two', 'three'];
        localeDict = ['uno', 'dos', 'tres'];
        holeyDict = {1: 'one', 4: 'two', 6: 'three'};

        collection = new EnumType({
            dictionary: dict
        });

        holeyCollection = new EnumType({
            dictionary: holeyDict
        });

        display = new EnumDisplay({
            collection
        });

        holeyDisplay = new EnumDisplay({
            collection: holeyCollection
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
        it('should throw an error for not IEnum', () => {
            let display;

            assert.throws(() => {
                display = new EnumDisplay({
                    collection: [] as any
                });
            });
            assert.throws(() => {
                display = new EnumDisplay({
                    collection: {} as any
                });
            });
            assert.throws(() => {
                display = new EnumDisplay({
                    collection: null
                });
            });
            assert.throws(() => {
                display = new EnumDisplay();
            });

            assert.isUndefined(display);
        });

        it('should take current from the Enum', () => {
            assert.strictEqual(display.getCurrent(), undefined);
            assert.strictEqual(display.getCurrentPosition(), -1);

            collection.set(1);
            const displayToo = new EnumDisplay({
                collection
            });

            assert.strictEqual(displayToo.getCurrent().getContents(), collection.getAsValue());
            assert.strictEqual(displayToo.getCurrentPosition(), collection.get());
        });
    });

    describe('.each()', () => {
        it('should return original values', () => {
            const collection = new EnumType({
                dictionary: dict
            });
            const display = new EnumDisplay({
                collection
            });

            display.each((item, index) => {
                assert.strictEqual(item.getContents(), dict[index]);
            });
        });

        it('should return localized values', () => {
            const collection = new EnumType({
                dictionary: dict,
                localeDictionary: localeDict
            });
            const display = new EnumDisplay({
                collection
            });

            display.each((item, index) => {
                assert.strictEqual(item.getContents(), localeDict[index]);
            });
        });
    });

    describe('.setCurrent()', () => {
        it('should change current of the Enum', () => {
            for (let index = 0; index < dict.length; index++) {
                const item = display.at(index);
                display.setCurrent(item);
                assert.strictEqual(collection.get(), index);
                assert.strictEqual(collection.getAsValue(), item.getContents());
            }
        });
    });

    describe('.setCurrentPosition()', () => {
        it('should change current of the Enum', () => {
            for (let index = 0; index < dict.length; index++) {
                display.setCurrentPosition(index);
                const item = display.getCurrent();
                assert.strictEqual(collection.get(), index);
                assert.strictEqual(collection.getAsValue(), item.getContents());
            }
        });

        it('should reset the Enum', () => {
            const collection = new EnumType({
                dictionary: dict,
                index: 0
            });
            const display = new EnumDisplay({
                collection
            });

            assert.strictEqual(collection.get(), 0);
            display.setCurrentPosition(-1);
            assert.isNull(collection.get());
        });
    });

    describe('.moveToNext()', () => {
        it('should change current of the Enum', () => {
            while (display.moveToNext()) {
                const index = display.getCurrentPosition();
                const item = display.getCurrent();
                assert.strictEqual(collection.get(), index);
                assert.strictEqual(collection.getAsValue(), item.getContents());
            }
        });
    });

    describe('.moveToPrevious()', () => {
        it('should change current of the Enum', () => {
            display.moveToLast();
            while (display.moveToPrevious()) {
                const index = display.getCurrentPosition();
                const item = display.getCurrent();
                assert.strictEqual(collection.get(), index);
                assert.strictEqual(collection.getAsValue(), item.getContents());
            }
        });
    });

    describe('.getIndexBySourceItem()', () => {
        it('should return value index', () => {
            for (let index = 0; index < dict.length; index++) {
                assert.equal(display.getIndexBySourceItem(dict[index]), index);
            }
        });

        it('should return localized value index', () => {
            const collection = new EnumType({
                dictionary: dict,
                localeDictionary: localeDict
            });
            const display = new EnumDisplay({
                collection
            });

            for (let index = 0; index < localeDict.length; index++) {
                assert.equal(display.getIndexBySourceItem(localeDict[index]), index);
            }
        });
    });

    describe('.getSourceIndexByItem()', () => {
        it('should return localized value index', () => {
            const collection = new EnumType({
                dictionary: dict,
                localeDictionary: localeDict
            });
            const display = new EnumDisplay({
                collection
            });
            const item = display.at(0);

            assert.equal(display.getSourceIndexByItem(item), 0);
        });

        it('should return right source index if enum have holes', () => {
            const item = holeyDisplay.at(1);
            assert.equal(holeyDisplay.getSourceIndexByItem(item), 4);
        });
    });

    describe('.getIndexBySourceIndex()', () => {
        it('should return right source index if enum have holes', () => {
            assert.equal(holeyDisplay.getIndexBySourceIndex(4), 1);
        });
    });

    describe('.subscribe()', () => {
        it('should trigger "onCurrentChange" if current of the Enum changed', () => {
            const given: any = {};
            const handler = (event, newCurrent, oldCurrent, newPosition, oldPosition) => {
                given.newCurrent = newCurrent;
                given.oldCurrent = oldCurrent;
                given.newPosition = newPosition;
                given.oldPosition = oldPosition;
            };

            display.subscribe('onCurrentChange', handler);
            collection.set(0);
            display.unsubscribe('onCurrentChange', handler);

            assert.strictEqual(given.newCurrent.getContents(), collection.getAsValue());
            assert.strictEqual(given.oldCurrent, undefined);
            assert.strictEqual(given.newPosition, collection.get());
            assert.strictEqual(given.oldPosition, -1);
        });
    });
});
