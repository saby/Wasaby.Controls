import { assert } from 'chai';
import { spy } from 'sinon';
import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { ScrollController } from 'Controls/list';

describe('Controls/list_clean/ScrollController', () => {
    const items = new RecordSet({
        rawData: [],
        keyProperty: 'key'
    });
    describe('constructor', () => {
        it('needScrollCalculation === true.', () => {
            const collection = new Collection({
                collection: items
            });
            const setViewIteratorSpy = spy(collection, 'setViewIterator');
            const controller = new ScrollController({
                collection,
                virtualScrollConfig: {},
                useNewModel: true,
                needScrollCalculation: true
            });

            assert.isTrue(setViewIteratorSpy.called);
        });
        it('needScrollCalculation === false.', () => {
            const collection = new Collection({
                collection: items
            });
            const setViewIteratorSpy = spy(collection, 'setViewIterator');
            const controller = new ScrollController({
                collection,
                virtualScrollConfig: {},
                useNewModel: true,
                needScrollCalculation: false
            });

            assert.isFalse(setViewIteratorSpy.called);
        });
    });

    describe('update', () => {
        it('needScrollCalculation === true.', () => {
            const collection = new Collection({
                collection: items
            });
            const controller = new ScrollController({
                collection,
                virtualScrollConfig: {},
                useNewModel: true,
                needScrollCalculation: true
            });
            const newCollection = new Collection({
                collection: items
            });
            const setViewIteratorSpy = spy(newCollection, 'setViewIterator');
            controller.update({
                collection: newCollection,
                virtualScrollConfig: {},
                useNewModel: true,
                needScrollCalculation: false
            }, {});
            assert.isFalse(setViewIteratorSpy.called);
        });
        it('needScrollCalculation === false.', () => {
            const collection = new Collection({
                collection: items
            });
            const controller = new ScrollController({
                collection,
                virtualScrollConfig: {},
                useNewModel: true,
                needScrollCalculation: false
            });
            const newCollection = new Collection({
                collection: items
            });
            const setViewIteratorSpy = spy(newCollection, 'setViewIterator');
            controller.update({
                collection: newCollection,
                virtualScrollConfig: {},
                useNewModel: true,
                needScrollCalculation: true
            });
            assert.isTrue(setViewIteratorSpy.called);
        });
    });

    describe('attachLoadTopTriggerToNull', () => {
        describe('mount', () => {
            it('attachLoadTopTriggerToNull === true', () => {
                const collection = new Collection({
                    collection: items
                });
                const controller = new ScrollController({
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: true
                });
                let result = controller.update({
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: true
                }, {clientHeight: 100, scrollHeight: 300, scrollTop: 0});

                assert.strictEqual(result.triggerOffset.top, 0);
            });
            it('attachLoadTopTriggerToNull === false', () => {
                const collection = new Collection({
                    collection: items
                });
                const controller = new ScrollController({
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: false
                });

                let result = controller.update({
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: false
                }, {clientHeight: 100, scrollHeight: 300, scrollTop: 0});

                assert.strictEqual(result.triggerOffset.top, 30);
            });
        });
        describe('update', () => {
            it('attachLoadTopTriggerToNull === true -> false', () => {
                const collection = new Collection({
                    collection: items
                });
                let options = {
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: true
                };
                const controller = new ScrollController(options);

                let result = controller.update({
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: false
                }, {clientHeight: 100, scrollHeight: 300, scrollTop: 0});


                assert.strictEqual(result.triggerOffset.top, 30);
            });
            it('attachLoadTopTriggerToNull === false -> true', () => {
                const collection = new Collection({
                    collection: items
                });
                let options = {
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: false
                };
                const controller = new ScrollController(options);

                let result = controller.update({
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: true
                }, {clientHeight: 100, scrollHeight: 300, scrollTop: 0});


                assert.strictEqual(result.triggerOffset.top, 0);
            });
        });
    });
});
