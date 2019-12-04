import { assert } from 'chai';

import * as itemActionsUtil from 'Controls/_listRender/Containers/ItemActions/processItemActions';


describe('Controls/_listRender/Containers/ItemActions/processItemActions', () => {
    describe('.processItemActionClick()', () => {
        it('opens submenu if action has subactions', (done) => {
            const item = {};
            const boundingClientRect = {};
            const event = {
                bubbling: true,
                default: true,
                target: {
                    getBoundingClientRect() {
                        return boundingClientRect;
                    }
                },
                nativeEvent: {},
                stopPropagation() { event.bubbling = false; },
                preventDefault() { event.default = false; }
            };
            const action = {
                'parent@': true,
                id: 3
            };
            const menuActions = [{ id: 1 }, { id: 2 }];
            const model = {
                activeItem: null,
                getItemActionsManager() {
                    return {
                        getChildActions() {
                            return menuActions;
                        }
                    };
                },
                setActiveItem(item) {
                    model.activeItem = item;
                }
            };
            const control = {
                _options: {
                    listModel: model
                },
                _notify(eventName) {
                    assert.strictEqual(eventName, 'requestDropdownMenuOpen');
                    assert.strictEqual(model.activeItem, item);
                    assert.isFalse(event.bubbling);
                    assert.isTrue(event.default);
                    done();
                }
            };
            itemActionsUtil.processItemActionClick.call(control, event, action, item);
        });

        it('executes handler and fires actionClick', () => {
            const contents = {};
            const item = {
                getContents() {
                    return contents;
                }
            };
            const boundingClientRect = {};
            const event = {
                bubbling: true,
                default: true,
                target: {
                    getBoundingClientRect() {
                        return boundingClientRect;
                    }
                },
                nativeEvent: {},
                stopPropagation() { event.bubbling = false; },
                preventDefault() { event.default = false; }
            };
            let actionHandlerCalled = false;
            let actionHandlerParameter;
            const action = {
                id: 3,
                handler(param) {
                    actionHandlerCalled = true;
                    actionHandlerParameter = param;
                }
            };
            const menuActions = [{ id: 1 }, { id: 2 }];
            const model = {
                activeItem: null,
                getItemActionsManager() {
                    return {
                        getChildActions() {
                            return menuActions;
                        }
                    };
                },
                setActiveItem(item) {
                    model.activeItem = item;
                },
                getStartIndex() { return 0; },
                getSourceIndexByItem() { return 10; }
            };
            let actionClickFired = false;
            let actionClickParameter;
            const control = {
                _options: {
                    listModel: model
                },
                _notify(eventName, params) {
                    if (eventName === 'actionClick') {
                        actionClickFired = true;
                        actionClickParameter = params[0];
                    }
                },
                _container: {
                    querySelector() {
                        return {
                            parentNode: {
                                children: []
                            }
                        };
                    }
                }
            };
            itemActionsUtil.processItemActionClick.call(control, event, action, item);

            assert.isTrue(actionClickFired);
            assert.strictEqual(actionClickParameter, action);
            assert.isTrue(actionHandlerCalled);
            assert.strictEqual(actionHandlerParameter, contents);
        });
    });

    it('.openActionsMenu()', (done) => {
        const item = {};
        const boundingClientRect = {};
        const event = {
            bubbling: true,
            default: true,
            target: {
                getBoundingClientRect() {
                    return boundingClientRect;
                }
            },
            nativeEvent: {},
            stopPropagation() { event.bubbling = false; },
            preventDefault() { event.default = false; }
        };
        const menuActions = [{ id: 1 }, { id: 2 }];
        const model = {
            activeItem: null,
            getItemActionsManager() {
                return {
                    getMenuActions() {
                        return menuActions;
                    }
                };
            },
            setActiveItem(item) {
                model.activeItem = item;
            }
        };
        const control = {
            _options: {
                listModel: model
            },
            _notify(eventName) {
                assert.strictEqual(eventName, 'requestDropdownMenuOpen');
                assert.strictEqual(model.activeItem, item);
                assert.isFalse(event.bubbling);
                assert.isFalse(event.default);
                done();
            }
        };

        itemActionsUtil.openActionsMenu.call(control, item, event);
    });

    describe('.closeActionsMenu()', () => {
        it('closes the dropdown menu', (done) => {
            const model = {
                activeItem: {},
                setActiveItem(item) {
                    model.activeItem = item;
                }
            };
            const control = {
                _options: {
                    listModel: model
                },
                _notify(eventName) {
                    assert.strictEqual(eventName, 'requestDropdownMenuClose');
                    assert.isNull(model.activeItem);
                    done();
                }
            };
            itemActionsUtil.closeActionsMenu.call(control);
        });

        it('calls handler if action was clicked', (done) => {
            const item = {
                getContents() {
                    return {};
                }
            };
            const action = {
                _isMenu: true
            };
            let triedOpenSubmenu = false;
            const model = {
                activeItem: item,
                setActiveItem(item) {
                    model.activeItem = item;
                },
                getActiveItem() {
                    return model.activeItem;
                },
                getItemActionsManager() {
                    return {
                        getMenuActions() {
                            triedOpenSubmenu = true;
                            return [];
                        }
                    };
                }
            };
            const control = {
                _options: {
                    listModel: model
                },
                _notify(eventName) {
                    assert.strictEqual(eventName, 'requestDropdownMenuClose');
                    assert.isNull(model.activeItem);
                    assert.isTrue(triedOpenSubmenu);
                    done();
                }
            };
            itemActionsUtil.closeActionsMenu.call(
                control,
                {
                    action: 'itemClick',
                    data: [{
                        getRawData() {
                            return action;
                        }
                    }],
                    event: {
                        stopPropagation() {},
                        preventDefault() {}
                    }
                }
            );
        });

        it('does not close menu if clicked action has children', () => {
            const item = {
                getContents() {
                    return {};
                }
            };
            const action = {
                _isMenu: true,
                'parent@': true
            };
            const model = {
                activeItem: item,
                setActiveItem(item) {
                    model.activeItem = item;
                },
                getActiveItem() {
                    return model.activeItem;
                },
                getItemActionsManager() {
                    return {
                        getMenuActions() {
                            return [];
                        }
                    };
                }
            };
            let dropdownClosed = false;
            const control = {
                _options: {
                    listModel: model
                },
                _notify(eventName) {
                    if (eventName === 'requestDropdownMenuClose') {
                        dropdownClosed = true;
                    }
                }
            };
            itemActionsUtil.closeActionsMenu.call(
                control,
                {
                    action: 'itemClick',
                    data: [{
                        getRawData() {
                            return action;
                        }
                    }],
                    event: {
                        stopPropagation() {},
                        preventDefault() {}
                    }
                }
            );
            assert.isFalse(dropdownClosed);
        });
    });
});
