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

    describe('attachLoadTopTriggerToNull', () => {
        describe('mount', () => {
            it('attachLoadTopTriggerToNull === true', () => {
                const collection = new Collection({
                    collection: items
                });
                let topTriggerOffset = null;
                const controller = new ScrollController({
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: true,
                    callbacks: {
                        triggerOffsetChanged: (topOffset) => {
                            topTriggerOffset = topOffset;
                        },
                        updateShadowMode: () => {},
                        viewportResize: () => {}
                    }
                });

                const container = {
                    getElementsByClassName: () => {
                        return [{
                            offsetHeight: 50
                        }];
                    }
                };

                const triggers = {
                    topVirtualScrollTrigger: {
                        style: {}
                    },
                    bottomVirtualScrollTrigger: {
                        style: {}
                    }
                };

                controller.afterMount(container, triggers);
                controller.observeScroll('viewportResize', { clientHeight: 150 });
                assert.strictEqual(topTriggerOffset, 0);
            });
            it('attachLoadTopTriggerToNull === false', () => {
                const collection = new Collection({
                    collection: items
                });
                let topTriggerOffset = null;
                const controller = new ScrollController({
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: false,
                    callbacks: {
                        triggerOffsetChanged: (topOffset) => {
                            topTriggerOffset = topOffset;
                        },
                        updateShadowMode: () => {},
                        viewportResize: () => {}
                    }
                });

                const container = {
                    getElementsByClassName: () => {
                        return [{
                            offsetHeight: 50
                        }];
                    }
                };

                const triggers = {
                    topVirtualScrollTrigger: {
                        style: {}
                    },
                    bottomVirtualScrollTrigger: {
                        style: {}
                    }
                };

                controller.afterMount(container, triggers);
                controller.observeScroll('viewportResize', { clientHeight: 150 });
                assert.strictEqual(topTriggerOffset, 15);
            });
        });
        describe('update', () => {
            it('attachLoadTopTriggerToNull === true -> false', () => {
                const collection = new Collection({
                    collection: items
                });
                let topTriggerOffset = null;
                let options = {
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: true,
                    callbacks: {
                        triggerOffsetChanged: (topOffset) => {
                            topTriggerOffset = topOffset;
                        },
                        updateShadowMode: () => {},
                        viewportResize: () => {}
                    }
                };
                const controller = new ScrollController(options);

                const container = {
                    getElementsByClassName: () => {
                        return [{
                            offsetHeight: 50
                        }];
                    }
                };

                const triggers = {
                    topVirtualScrollTrigger: {
                        style: {}
                    },
                    bottomVirtualScrollTrigger: {
                        style: {}
                    }
                };

                controller.afterMount(container, triggers);
                controller.observeScroll('viewportResize', { clientHeight: 150 });
                options = {
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: false,
                    callbacks: {
                        triggerOffsetChanged: (topOffset) => {
                            topTriggerOffset = topOffset;
                        },
                        updateShadowMode: () => {},
                        viewportResize: () => {}
                    }
                };
                controller.update(options);
                assert.strictEqual(topTriggerOffset, 15);
            });
            it('attachLoadTopTriggerToNull === false -> true', () => {
                const collection = new Collection({
                    collection: items
                });
                let topTriggerOffset = null;
                let options = {
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: false,
                    callbacks: {
                        triggerOffsetChanged: (topOffset) => {
                            topTriggerOffset = topOffset;
                        },
                        updateShadowMode: () => {},
                        viewportResize: () => {}
                    }
                };
                const controller = new ScrollController(options);

                const container = {
                    getElementsByClassName: () => {
                        return [{
                            offsetHeight: 50
                        }];
                    }
                };

                const triggers = {
                    topVirtualScrollTrigger: {
                        style: {}
                    },
                    bottomVirtualScrollTrigger: {
                        style: {}
                    }
                };

                controller.afterMount(container, triggers);
                controller.observeScroll('viewportResize', { clientHeight: 150 });
                options = {
                    collection,
                    virtualScrollConfig: {},
                    needScrollCalculation: false,
                    attachLoadTopTriggerToNull: true,
                    callbacks: {
                        triggerOffsetChanged: (topOffset) => {
                            topTriggerOffset = topOffset;
                        },
                        updateShadowMode: () => {},
                        viewportResize: () => {}
                    }
                };
                controller.update(options);
                assert.strictEqual(topTriggerOffset, 0);
            });
        });
    });
});
