define("ControlsUnit/List/Controllers/ScrollPaging.test", ["require", "exports", "chai", "Controls/_list/Controllers/ScrollPaging"], function (require, exports, chai_1, ScrollPaging_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Controls.Controllers.ScrollPaging', function () {
        describe('constructor', function () {
            it('top position', function () {
                var result;
                var spInstance = new ScrollPaging_1.default({
                    scrollParams: {
                        scrollTop: 0,
                        scrollHeight: 150,
                        clientHeight: 50
                    },
                    pagingCfgTrigger: function (cfg) {
                        result = cfg;
                    }
                });
                chai_1.assert.equal('top', spInstance._curState, 'Wrong curState after ctor');
                chai_1.assert.deepEqual({
                    backwardEnabled: false,
                    forwardEnabled: true,
                }, result, 'Wrong pagingCfg after ctor');
            });
            it('middle position', function () {
                var result;
                var spInstance = new ScrollPaging_1.default({
                    scrollParams: {
                        scrollTop: 50,
                        scrollHeight: 150,
                        clientHeight: 50
                    },
                    pagingCfgTrigger: function (cfg) {
                        result = cfg;
                    }
                });
                chai_1.assert.equal('middle', spInstance._curState, 'Wrong curState after ctor');
                chai_1.assert.deepEqual({
                    backwardEnabled: true,
                    forwardEnabled: true,
                }, result, 'Wrong pagingCfg after ctor');
            });
            it('top position', function () {
                var result;
                var spInstance = new ScrollPaging_1.default({
                    scrollParams: {
                        scrollTop: 100,
                        scrollHeight: 150,
                        clientHeight: 50
                    },
                    pagingCfgTrigger: function (cfg) {
                        result = cfg;
                    }
                });
                chai_1.assert.equal('bottom', spInstance._curState, 'Wrong curState after ctor');
                chai_1.assert.deepEqual({
                    backwardEnabled: true,
                    forwardEnabled: false,
                }, result, 'Wrong pagingCfg after ctor');
            });
        });
        describe('scroll', function () {
            var result;
            var spInstance = new ScrollPaging_1.default({
                scrollParams: {
                    scrollTop: 0,
                    scrollHeight: 150,
                    clientHeight: 50
                },
                pagingCfgTrigger: function (cfg) {
                    result = cfg;
                }
            });
            it('middle', function () {
                spInstance.handleScroll('middle');
                chai_1.assert.equal('middle', spInstance._curState, 'Wrong curState after scroll');
                chai_1.assert.deepEqual({
                    backwardEnabled: true,
                    forwardEnabled: true,
                }, result, 'Wrong pagingCfg after scroll');
            });
            it('top', function () {
                spInstance.handleScroll('up');
                chai_1.assert.equal('top', spInstance._curState, 'Wrong curState after scroll to top');
                chai_1.assert.deepEqual({
                    backwardEnabled: false,
                    forwardEnabled: true,
                }, result, 'Wrong pagingCfg after scroll');
            });
            it('bottom', function () {
                spInstance.handleScroll('down');
                chai_1.assert.equal('bottom', spInstance._curState, 'Wrong curState after scroll to bottom');
                chai_1.assert.deepEqual({
                    backwardEnabled: true,
                    forwardEnabled: false,
                }, result, 'Wrong pagingCfg after scroll');
            });
        });
        describe('updateScrollParams', function () {
            var result;
            var spInstance = new ScrollPaging_1.default({
                scrollParams: {
                    scrollTop: 150,
                    scrollHeight: 250,
                    clientHeight: 50
                },
                pagingCfgTrigger: function (cfg) {
                    result = cfg;
                }
            });
            it('make big window and reach bottom', function () {
                spInstance.updateScrollParams({
                    scrollTop: 150,
                    scrollHeight: 250,
                    clientHeight: 100
                });
                chai_1.assert.equal('bottom', spInstance._curState, 'Wrong curState after updateScrollParams');
                chai_1.assert.deepEqual({
                    backwardEnabled: true,
                    forwardEnabled: false,
                }, result, 'Wrong pagingCfg after scroll');
            });
        });
    });
});
