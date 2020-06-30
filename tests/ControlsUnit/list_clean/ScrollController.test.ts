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
            const subscribeSpy = spy(collection, 'subscribe');
            const setViewIteratorSpy = spy(collection, 'setViewIterator');
            const controller = new ScrollController({
                collection,
                virtualScrollConfig: {},
                useNewModel: true,
                needScrollCalculation: true
            });

            assert.isTrue(subscribeSpy.withArgs('onCollectionChange').calledOnce);
            assert.isTrue(setViewIteratorSpy.called);
        });
        it('needScrollCalculation === false.', () => {
            const collection = new Collection({
                collection: items
            });
            const subscribeSpy = spy(collection, 'subscribe');
            const setViewIteratorSpy = spy(collection, 'setViewIterator');
            const controller = new ScrollController({
                collection,
                virtualScrollConfig: {},
                useNewModel: true,
                needScrollCalculation: false
            });

            assert.isFalse(subscribeSpy.withArgs('onCollectionChange').calledOnce);
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
            const subscribeSpy = spy(newCollection, 'subscribe');
            const setViewIteratorSpy = spy(newCollection, 'setViewIterator');
            controller.update({
                collection: newCollection,
                virtualScrollConfig: {},
                useNewModel: true,
                needScrollCalculation: false
            });
            assert.isFalse(subscribeSpy.withArgs('onCollectionChange').calledOnce);
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
            const subscribeSpy = spy(newCollection, 'subscribe');
            const setViewIteratorSpy = spy(newCollection, 'setViewIterator');
            controller.update({
                collection: newCollection,
                virtualScrollConfig: {},
                useNewModel: true,
                needScrollCalculation: true
            });
            assert.isTrue(subscribeSpy.withArgs('onCollectionChange').calledOnce);
            assert.isTrue(setViewIteratorSpy.called);
        });
    });
});
