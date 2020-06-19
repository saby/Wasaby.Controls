import {Controller} from 'Controls/operations';
import {assert} from 'chai';
import {stub} from 'sinon';

describe('Controls/operations:Controller', () => {

    let controller;
    beforeEach(() => {
        controller = new Controller({});
        controller.saveOptions({});
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

    describe('selectionViewModeChanged', () => {
       it('selectionViewModeChanged on itemOpenHandler', () => {
           const notifyStub = stub(controller, '_notify');
           controller._options.selectionViewMode = 'selected';
           controller._itemOpenHandler('root');

           assert.isTrue(notifyStub.withArgs('selectionViewModeChanged').calledOnce);
           notifyStub.restore();
       });

        it('selectionViewModeChanged on selectionType changed', () => {
            const notifyStub = stub(controller, '_notify');
            controller._selectedTypeChangedHandler({}, 'selected');
            assert.isTrue(notifyStub.withArgs('selectionViewModeChanged').calledOnce);
            notifyStub.restore();
        });
    });
});
