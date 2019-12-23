import ScrollController from 'Controls/_list/ScrollContainer';

describe('Controls/_list/ScrollContainer', () => {
    describe('_afterMount', () => {
        const instance = new ScrollController();
        instance._options = {};
        it('flag inited', () => {
            instance._afterMount();
            assert.isTrue(instance.__mounted);
        });
        it('scroll registered correctly', () => {
            instance._children = {
                scrollEmitter: {
                    // Mocked
                    startRegister() {
                        instance.__scrollRegistered = true;
                    }
                }
            };
            instance._options = {observeScroll: false};
            instance._afterMount();
            assert.isUndefined(instance.__scrollRegistered);
            instance._options = {observeScroll: true};
            instance._afterMount();
            assert.isTrue(instance.__scrollRegistered);
        });
    });
    describe('_beforeRender', () => {
        it('saveScrollPosition notified correctly', () => {
            const instance = new ScrollController();
            instance._options = {};
            instance._notify = (eventName: string, eventArguments: unknown[], params: { bubbling: boolean }) => {
                instance.lastNotifiedEventName = eventName;
                instance.lastNotifiedArguments = eventArguments;
                instance.lastNotifiedParams = params;
            };

            instance._beforeRender();
            assert.notEqual('saveScrollPosition', instance.lastNotifiedEventName);
            instance.saveScrollPosition = true;
            instance._beforeRender();
            assert.isTrue(instance.lastNotifiedParams.bubbling);
            assert.equal('saveScrollPosition', instance.lastNotifiedEventName);
        });
    });
    describe('_afterRender', () => {
        it('update virtual scroll items heights', () => {
            const instance = new ScrollController();
            instance.virtualScroll = {
                itemsContainer: {},
                recalcItemsHeights() {
                    this.__recalcCalled = true
                },
                __recalcCalled: false
            };
            // mocked
            instance._notify = () => {
            };
            it('items did not change', () => {
                instance.itemsChanged = false;
                instance._afterRender();
                assert.isFalse(instance.virtualScroll.__recalcCalled);
            });
            it('items changed', () => {
                instance.itemsChanged = true;
                instance._afterRender();
                assert.isTrue(instance.virtualScroll.__recalcCalled);
                assert.isFalse(instance.itemsChanged);
            });
        });
        it('updateShadowMode called', () => {
            const instance = new ScrollController();
            instance.placeholdersSizes = {
                top: 0,
                bottom: 0
            };
            instance._notify = (eventName: string, eventArguments: unknown[]) => {
                instance.eventName = eventName;
                instance.eventArguments = eventArguments;
            };

            instance._afterRender();
            assert.deepEqual({top: 0, bottom: 0}, instance.eventArguments[0]);
        });
        it('applyScrollTopCallback called', () => {
            const instance = new ScrollController();
            instance.virtualScroll = {};
            instance.applyScrollTopCallback = () => {
                instance.applyScrollTopCallbackCalled = true
            };
            instance._afterRender();
            assert.isTrue(instance.applyScrollTopCallbackCalled);
        });
        it('afterRenderCallback called', () => {
            const instance = new ScrollController();
            instance.afterRenderCallback = () => {
                instance.afterRenderCallbackCalled = true
            };
            instance._afterRender();
            assert.isTrue(instance.afterRenderCallbackCalled);
        });
        it('position restored', () => {
            const instance = new ScrollController();
            instance._notify = (eventName: string, eventArguments: unknown[], eventParams: { bubbling: boolean }) => {
                instance.eventName = eventName;
                instance.eventArguments = eventArguments;
                instance.eventParams = eventParams;
            };
            instance.virtualScroll = {
                scrollTop: 100,
                getRestoredScrollPosition() {
                    return 102;
                },
                actualizeSavedIndexes() {}
            };
            instance.saveScrollPosition = true;
            instance.savedScrollDirection = 'up';
            instance.actualStartIndex = 0;
            instance.savedStartIndex = 2;
            instance.triggerVisibility = {};
            instance._afterRender();
            assert.isTrue(instance.eventParams.bubbling);
            assert.equal(102, instance.eventArguments[0]);
            assert.isFalse(instance.saveScrollPosition);
            assert.isNull(instance.savedScrollDirection);
        });
    });
    describe('itemsContainerReadyHandler', () => {
        it('container saved', () => {
            const instance = new ScrollController();
            const container = {};
            instance._options = {virtualScrolling: true};
            instance.virtualScroll = {};
            instance.itemsContainerReadyHandler({}, container);
            assert.equal(instance.virtualScroll.itemsContainer, container);
            assert.equal(instance.itemsContainer, container);
        });
    });
    describe('viewResize', () => {
        it('heights updated', () => {
            const instance = new ScrollController();
            instance.virtualScroll = {
                recalcItemsHeights() {
                    this.__recalcCalled = true;
                }
            };
            instance.__mounted = true;
            instance.viewResizeHandler();
            assert.isTrue(instance.virtualScroll.__recalcCalled);
        });
    });
    describe('scrollToItem', () => {
        const instance = {
            scrollToElement() {
                this.scrollCalled = true;
            },
            itemsContainer: {
                children: [{}]
            },
            _options: {
                viewModel: {
                    getIndexByKey(key) {
                        return key;
                    }
                }
            }
        };

        it('without virtual scroll', () => {
            ScrollController.prototype.scrollToItem.call(instance, 0);
            assert.isTrue(instance.scrollCalled);
        });
        it('with virtual scroll', () => {
            instance.virtualScroll = {
                recalcFromIndex() {
                    this.__recalcCalled = true;
                }
            };
            instance.scrollToElement = (el) => {
                this.scrolledElement = el;
            };
            it('without recalc', () => {
                instance.virtualScroll.canScrollToItem = () => true;
                it('with virtual scroll mode "remove"', () => {
                    instance.actualScrollIndex = 1;
                    ScrollController.prototype.scrollToItem.call(instance, 5);
                    assert.equal(instance.scrolledElement, 3);
                });
                it('with virtual scroll mode "hide"', () => {
                    ScrollController.prototype.scrollToItem.call(instance, 5);
                    assert.equal(instance.scrolledElement, 4);
                });
            });
            it('with recalc', () => {
                instance.virtualScroll.canScrollToItem = () => false;
                ScrollController.prototype.scrollToItem.call(instance, 5);
                assert.isTrue(instance.virtualScroll.__recalcCalled);
            });
        });
    });
    describe('reset', () => {
        const instance = new ScrollController();
        instance.virtualScroll = {
            reset() {
                this.resetCalled = true;
            }
        };
        instance.viewModel = {
            getIndexByKey() {}
        };
        it('reset correctly', () => {
            instance.reset(5);
            assert.equal(instance.virtualScroll.itemsCount, 5);
            assert.isTrue(instance.itemsChanged);
            assert.isTrue(instance.virtualScroll.resetCalled);
        });
        it('initial key', () => {
            instance.viewModel.getIndexByKey = (index) => { if (index === 1) { return 1 } else { return 0 }};
            instance.virtualScroll.reset = (index) => { instance.virtualScroll.index = index };

            instance.reset(5, 1);
            assert.equal(instance.virtualScroll.index, 1);
            instance.reset(5, 2);
            assert.equal(instance.virtualScroll.index, 0);
            instance.reset(5);
            assert.equal(instance.virtualScroll.index, 0);
        });
    });
    describe('checkCapability', () => {
        const instance = new ScrollController();
        instance.virtualScroll = {
            recalcRangeToDirection(direction) {
                this.recalcDirection = direction;
            },
            triggerVisibility: {},
            isLoaded: () => true
        };
        instance._options = {
            virtualScrolling: true
        };
        instance.triggerVisibility = {
            up: false, down: false
        };

        it('update view window didn`t call', () => {
            instance.checkTriggerVisibility();
            assert.isUndefined(instance.virtualScroll.recalcDirection);
        });

        it('update view window called, direction up', () => {
            instance.triggerVisibility.up = true;
            instance.checkTriggerVisibility();
            assert.equal('up', instance.virtualScroll.recalcDirection);
            instance.triggerVisibility.up = false;
        });
        it('update view window called, direction down', () => {
            instance.triggerVisibility.down = true;
            instance.checkTriggerVisibility();
            assert.equal('down', instance.virtualScroll.recalcDirection);
            instance.triggerVisibility.down = false;
        });
    });
    describe('updateViewport', () => {
        const instance = {
            virtualScroll: {},
            _notify() {
            },
            _options: {
                virtualScrolling: true
            },
            proxyEvent() {
            }
        };

        it('offset recalc, viewport set', () => {
            ScrollController.prototype.updateViewport.call(instance, 2);
            assert.equal (0.6, instance.virtualScroll.triggerOffset);
            assert.equal(0.6, instance.topTriggerOffset);
            assert.equal(0.6, instance.bottomTriggerOffset);
            assert.equal(2, instance.virtualScroll.viewportHeight);
        });
    });
    describe('handleListScrollSync', () => {
        const instance = {
            _options: {
                virtualScrolling: true
            },
            fakeScroll: true,
            virtualScroll: {},
            proxyEvent() {}
        };

        it('scroll top set', () => {
            ScrollController.prototype.handleListScrollSync.call(instance, {scrollTop: 400});
            assert.equal(400, instance.virtualScroll.scrollTop);
        });
    });
    describe('indexesChangedCallback', () => {
        const instance = new ScrollController();
        instance.viewModel = {
            setViewIndices(startIndex, stopIndex) {
                return startIndex !== this.startIndex || stopIndex !== this.stopIndex;
            },
            startIndex: 0,
            stopIndex: 19
        };
        instance.actualStartIndex = 0;
        instance.actualStopIndex = 19;

        it('indexes recalc, scroll direction saved', () => {
            instance.indexesChangedCallback(5, 24, 'up');
            assert.isTrue(instance.itemsChanged);
            assert.isTrue(instance.saveScrollPosition);
            assert.equal(instance.savedScrollDirection, 'up');
        });
    });
});