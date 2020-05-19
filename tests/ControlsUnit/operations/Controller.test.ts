import {Controller} from 'Controls/operations';
import {assert} from 'chai';

describe('Controls/operations:Controller', () => {

    let controller;
    beforeEach(() => {
        controller = new Controller({});
    });

    describe('_listMarkedKeyChangedHandler', () => {

        it('operationsPanel is closed', () => {
            controller._listMarkedKeyChangedHandler({}, 'testKey');
            assert.isNull(controller._listMarkedKey);
        });

        it('operationsPanel is opened', () => {
            controller._operationsPanelOpen();
            controller._listMarkedKeyChangedHandler({}, 'testKey');
            assert.equal(controller._listMarkedKey, 'testKey');
        });

    });

});