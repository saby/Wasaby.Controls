define("ControlsUnit/Input/Render/Render.test", ["require", "exports", "tslib", "chai", "sinon", "Vdom/Vdom", "Controls/input"], function (require, exports, tslib_1, chai_1, sinon_1, Vdom_1, input_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Controls.input:Render', function () {
        var inst;
        var defaultOptions = input_1.Render.getDefaultOptions();
        beforeEach(function () {
            inst = new input_1.Render(defaultOptions);
        });
        describe('_beforeMount', function () {
            describe('Check _border state', function () {
                it('visible', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { borderVisibility: 'visible' }));
                    chai_1.assert.deepEqual(inst._border, {
                        top: true,
                        right: true,
                        bottom: true,
                        left: true
                    });
                });
                it('partial', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { borderVisibility: 'partial', multiline: false }));
                    chai_1.assert.deepEqual(inst._border, {
                        top: false,
                        right: false,
                        bottom: true,
                        left: false
                    });
                });
                it('partial and multiline', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { borderVisibility: 'partial', multiline: true }));
                    chai_1.assert.deepEqual(inst._border, {
                        top: true,
                        right: false,
                        bottom: true,
                        left: false
                    });
                });
                it('hidden', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { borderVisibility: 'hidden' }));
                    chai_1.assert.deepEqual(inst._border, {
                        top: false,
                        right: false,
                        bottom: false,
                        left: false
                    });
                });
            });
            describe('Check _state and _statePrefix state', function () {
                it('readonly', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { readOnly: true }));
                    chai_1.assert.equal(inst._state, 'readonly');
                    chai_1.assert.equal(inst._statePrefix, '');
                });
                it('readonly and state', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { readOnly: true, state: 'test' }));
                    chai_1.assert.equal(inst._state, 'test-readonly');
                    chai_1.assert.equal(inst._statePrefix, '_test');
                });
                it('readonly and multiline', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { readOnly: true, multiline: true }));
                    chai_1.assert.equal(inst._state, 'readonly-multiline');
                    chai_1.assert.equal(inst._statePrefix, '');
                });
                it('readonly and multiline and state', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { readOnly: true, multiline: true, state: 'test' }));
                    chai_1.assert.equal(inst._state, 'test-readonly-multiline');
                    chai_1.assert.equal(inst._statePrefix, '_test');
                });
                it('borderStyle and validationStatus = valid', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { validationStatus: 'valid', borderStyle: 'success' }));
                    chai_1.assert.equal(inst._state, 'success');
                    chai_1.assert.equal(inst._statePrefix, '');
                });
                it('borderStyle and validationStatus = valid and state', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { validationStatus: 'valid', borderStyle: 'success', state: 'test' }));
                    chai_1.assert.equal(inst._state, 'test-success');
                    chai_1.assert.equal(inst._statePrefix, '_test');
                });
                it('validationStatus = invalid', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { validationStatus: 'invalid' }));
                    chai_1.assert.equal(inst._state, 'invalid');
                    chai_1.assert.equal(inst._statePrefix, '');
                });
                it('validationStatus = invalid and state', function () {
                    inst._beforeMount(tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { validationStatus: 'invalid', state: 'test' }));
                    chai_1.assert.equal(inst._state, 'test-invalid');
                    chai_1.assert.equal(inst._statePrefix, '_test');
                });
                it('validationStatus = invalid and contentActive', function () {
                    var options = tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { validationStatus: 'invalid' });
                    inst._beforeMount(options);
                    inst._options = options;
                    var event = new Vdom_1.SyntheticEvent({});
                    var sandbox = sinon_1.createSandbox();
                    sandbox.replace(input_1.Render, 'notSupportFocusWithin', function () { return true; });
                    inst._setContentActive(event, true);
                    chai_1.assert.equal(inst._state, 'invalid-active');
                    chai_1.assert.equal(inst._statePrefix, '');
                    sandbox.restore();
                });
                it('validationStatus = invalid and contentActive and state', function () {
                    var options = tslib_1.__assign(tslib_1.__assign({}, defaultOptions), { validationStatus: 'invalid', state: 'test' });
                    inst._beforeMount(options);
                    inst._options = options;
                    var event = new Vdom_1.SyntheticEvent({});
                    var sandbox = sinon_1.createSandbox();
                    sandbox.replace(input_1.Render, 'notSupportFocusWithin', function () { return true; });
                    inst._setContentActive(event, true);
                    chai_1.assert.equal(inst._state, 'test-invalid-active');
                    chai_1.assert.equal(inst._statePrefix, '_test');
                    sandbox.restore();
                });
            });
        });
    });
});
