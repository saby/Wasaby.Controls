define("ControlsUnit/List/Controllers/ScrollPaging.test", ["require", "exports", "chai", "sinon", "Controls/_list/Controllers/ScrollPaging"], function (require, exports, chai_1, sinon, ScrollPaging_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Controls/Controllers/ScrollPaging', function () {
        describe('constructor', function () {
            it('scroll at top position', function () {
                var cfg = {
                    scrollParams: {
                        scrollTop: 0,
                        scrollHeight: 150,
                        clientHeight: 50
                    },
                    pagingCfgTrigger: function (_) { return void 0; }
                };
                var stub = sinon.stub(cfg, 'pagingCfgTrigger');
                var spInstance = new ScrollPaging_1.default(cfg);
                chai_1.assert.equal('top', spInstance._curState, 'initial state must be \'top\'');
                sinon.assert.calledWith(stub, {
                    arrowState: {
                        begin: 'readonly',
                        end: 'hidden',
                        next: 'visible',
                        prev: 'readonly'
                    }
                });
            });
            it('scroll at middle position', function () {
                var cfg = {
                    scrollParams: {
                        scrollTop: 50,
                        scrollHeight: 150,
                        clientHeight: 50
                    },
                    pagingCfgTrigger: function (_) { return void 0; }
                };
                var stub = sinon.stub(cfg, 'pagingCfgTrigger');
                var spInstance = new ScrollPaging_1.default(cfg);
                chai_1.assert.equal('middle', spInstance._curState, 'initial state must be \'middle\'');
                sinon.assert.calledWith(stub, {
                    arrowState: {
                        begin: 'visible',
                        end: 'hidden',
                        next: 'visible',
                        prev: 'visible'
                    }
                });
            });
            it('scroll at bottom position', function () {
                var cfg = {
                    scrollParams: {
                        scrollTop: 100,
                        scrollHeight: 150,
                        clientHeight: 50
                    },
                    pagingCfgTrigger: function (_) { return void 0; }
                };
                var stub = sinon.stub(cfg, 'pagingCfgTrigger');
                var spInstance = new ScrollPaging_1.default(cfg);
                chai_1.assert.equal('bottom', spInstance._curState, 'initial state must be \'bottom\'');
                sinon.assert.calledWith(stub, {
                    arrowState: {
                        begin: 'visible',
                        end: 'hidden',
                        next: 'readonly',
                        prev: 'visible'
                    }
                });
            });
        });
        describe('updateScrollParams', function () {
            var cfg = {
                scrollParams: {
                    scrollTop: 150,
                    scrollHeight: 250,
                    clientHeight: 50
                },
                pagingCfgTrigger: function (_) { return void 0; }
            };
            var spInstance = new ScrollPaging_1.default(cfg);
            it('make big window and reach bottom', function () {
                var stub = sinon.stub(cfg, 'pagingCfgTrigger');
                spInstance.updateScrollParams({
                    scrollTop: 150,
                    scrollHeight: 250,
                    clientHeight: 100
                });
                chai_1.assert.equal('bottom', spInstance._curState, 'curState must be \'bottom\' after updating scrollParams');
                sinon.assert.calledWith(stub, {
                    arrowState: {
                        begin: 'visible',
                        end: 'hidden',
                        next: 'readonly',
                        prev: 'visible'
                    }
                });
            });
        });
        describe('pagingMode numbers', function () {
            describe('other methods', function () {
                var spInstance;
                beforeEach(function () {
                    spInstance = new ScrollPaging_1.default({
                        pagingMode: 'numbers',
                        loadedElementsCount: 10,
                        totalElementsCount: 100,
                        scrollParams: {
                            scrollTop: 0,
                            scrollHeight: 250,
                            clientHeight: 50
                        },
                        pagingCfgTrigger: function (_) { return void 0; }
                    });
                });
                it('initPagingData', function () {
                    chai_1.assert.deepEqual(spInstance._pagingData, { totalHeight: 2500, pagesCount: 50, averageElementHeight: 25 }, 'wrong calculated paging data');
                });
                it('getItemsCountOnPage', function () {
                    chai_1.assert.deepEqual(spInstance.getItemsCountOnPage(), 2, 'one page contains 2 items');
                });
                it('getNeededItemsCountForPage', function () {
                    chai_1.assert.deepEqual(spInstance.getNeededItemsCountForPage(1), 2, 'need 2 items to display 1 page');
                    chai_1.assert.deepEqual(spInstance.getNeededItemsCountForPage(2), 4, 'need 4 items to display 2 page');
                    spInstance.shiftToEdge('down', { up: true });
                    chai_1.assert.deepEqual(spInstance.getNeededItemsCountForPage(50), 2, 'need 2 items from bottom to display 50 page');
                    chai_1.assert.deepEqual(spInstance.getNeededItemsCountForPage(49), 4, 'need 4 items from bottom to display 49 page');
                });
                it('getScrollTopByPage numbersState = up', function () {
                    spInstance.shiftToEdge('up', { down: true });
                    spInstance.updateScrollParams({
                        scrollTop: 0,
                        scrollHeight: 250,
                        clientHeight: 50
                    }, { up: false, down: true });
                    chai_1.assert.equal(spInstance.getScrollTopByPage(1), 0, 'wrong scrollTop for page 1');
                    chai_1.assert.equal(spInstance.getScrollTopByPage(2), 50, 'wrong scrollTop for page 2');
                    chai_1.assert.equal(spInstance.getScrollTopByPage(3), 100, 'wrong scrollTop for page 3');
                });
                it('getScrollTopByPage numbersState = down', function () {
                    spInstance.shiftToEdge('down', { up: true });
                    spInstance.updateScrollParams({
                        scrollTop: 50,
                        scrollHeight: 250,
                        clientHeight: 50
                    }, { up: true, down: false });
                    chai_1.assert.equal(spInstance.getScrollTopByPage(50), 200, 'wrong scrollTop for page 10');
                    chai_1.assert.equal(spInstance.getScrollTopByPage(49), 150, 'wrong scrollTop for page 9');
                    chai_1.assert.equal(spInstance.getScrollTopByPage(48), 100, 'wrong scrollTop for page 8');
                });
            });
            describe('changing selectedPage', function () {
                var spInstance;
                var selectedPage;
                beforeEach(function () {
                    spInstance = new ScrollPaging_1.default({
                        pagingMode: 'numbers',
                        loadedElementsCount: 10,
                        totalElementsCount: 100,
                        scrollParams: {
                            scrollTop: 0,
                            scrollHeight: 250,
                            clientHeight: 50
                        },
                        pagingCfgTrigger: function (cfg) {
                            selectedPage = cfg.selectedPage;
                        }
                    });
                });
                it('changing page from top position', function () {
                    spInstance.shiftToEdge('up', {});
                    spInstance.updateScrollParams({
                        scrollTop: 0,
                        scrollHeight: 250,
                        clientHeight: 50
                    }, { up: false, down: true });
                    chai_1.assert.equal(selectedPage, 1, 'wrong selectedPage at the top');
                    spInstance.updateScrollParams({
                        scrollTop: 50,
                        scrollHeight: 250,
                        clientHeight: 50
                    }, { up: false, down: true });
                    chai_1.assert.equal(selectedPage, 2, 'wrong selectedPage at the 2 page');
                    spInstance.updateScrollParams({
                        scrollTop: 200,
                        scrollHeight: 250,
                        clientHeight: 50
                    }, { up: false, down: false });
                    chai_1.assert.equal(selectedPage, 50, 'wrong selectedPage after scrolling to bottom');
                });
                it('Changing page from bottom position', function () {
                    spInstance.shiftToEdge('down', { up: true, down: false });
                    spInstance.updateScrollParams({
                        scrollTop: 200,
                        scrollHeight: 250,
                        clientHeight: 50
                    }, { up: true, down: false });
                    chai_1.assert.equal(selectedPage, 50, 'wrong selectedPage after scrolling to bottom');
                    spInstance.updateScrollParams({
                        scrollTop: 150,
                        scrollHeight: 250,
                        clientHeight: 50
                    }, { up: true, down: false });
                    chai_1.assert.equal(selectedPage, 49, 'wrong selectedPage on prev page from bottom');
                    spInstance.updateScrollParams({
                        scrollTop: 0,
                        scrollHeight: 250,
                        clientHeight: 50
                    }, { up: false, down: false });
                    chai_1.assert.equal(selectedPage, 1, 'wrong selectedPage after scrolling to top');
                });
            });
        });
    });
});
