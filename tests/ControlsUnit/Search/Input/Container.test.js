define("ControlsUnit/Search/Input/Container.test", ["require", "exports", "chai", "Controls/search", "sinon"], function (require, exports, chai_1, search_1, sinon) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Controls/_search/Input/Container', function () {
        var sandbox = sinon.createSandbox();
        afterEach(function () { return sandbox.restore(); });
        it('_beforeUpdate', function () {
            var cont = new search_1.InputContainer({});
            cont.saveOptions({});
            cont._value = '';
            cont._beforeUpdate({ inputSearchValue: 'test' });
            chai_1.assert.equal(cont._value, 'test');
        });
        it('_notifySearch', function () {
            var cont = new search_1.InputContainer({});
            var stub = sandbox.stub(cont, '_notify');
            cont._notifySearch('test');
            chai_1.assert.isTrue(stub.withArgs('search', ['test']).calledOnce);
        });
        it('_searchClick', function () {
            var cont = new search_1.InputContainer({});
            cont._value = 'test';
            var stub = sandbox.stub(cont, '_notify');
            cont._searchClick(null);
            chai_1.assert.isTrue(stub.withArgs('search', ['test']).calledOnce);
            stub.reset();
            cont._value = '';
            cont._searchClick(null);
            chai_1.assert.isTrue(stub.notCalled);
        });
        it('_keyDown', function () {
            var cont = new search_1.InputContainer({});
            var propagationStopped = false;
            var event = {
                stopPropagation: function () {
                    propagationStopped = true;
                },
                nativeEvent: {
                    which: 13 // enter
                }
            };
            cont._keyDown(event);
            chai_1.assert.isTrue(propagationStopped);
        });
        describe('_valueChanged', function () {
            var cont = new search_1.InputContainer({});
            var called = false;
            cont._searchResolverController = { resolve: function (value) {
                    called = true;
                } };
            it('new value not equally old value', function () {
                cont._value = '';
                cont._valueChanged(null, 'newValue');
                chai_1.assert.equal(cont._value, 'newValue');
                chai_1.assert.isTrue(called);
            });
            it('new value equally old value', function () {
                called = false;
                cont._valueChanged(null, 'newValue');
                chai_1.assert.isFalse(called);
            });
        });
        describe('_beforeUnmount', function () {
            var cont;
            beforeEach(function () {
                cont = new search_1.InputContainer({});
            });
            it('should clear the timer on searchResolverController', function () {
                cont._searchResolverController = {
                    clearTimer: sandbox.stub()
                };
                cont._beforeUnmount();
                sinon.assert.calledOnce(cont._searchResolverController.clearTimer);
            });
            it('should not throw when the _searchResolverController doesn\'t exist', function () {
                chai_1.assert.doesNotThrow(function () {
                    cont._beforeUnmount();
                });
            });
        });
    });
});
