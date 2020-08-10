import {ControllerClass} from 'Controls/operations';
import {ok} from 'assert';

describe('Controls/operations:ControllerClass', () => {

    let controller;
    beforeEach(() => {
        controller = new ControllerClass({});
    });

    describe('setListMarkedKey', () => {

        it('setListMarkedKey, operations panel is hidden', () => {
            controller.setOperationsPanelVisible(false);
            ok(controller.setListMarkedKey('testKey') === null);
        });

        it('setListMarkedKey, operations panel is visible', () => {
            controller.setOperationsPanelVisible(true);
            ok(controller.setListMarkedKey('testKey') === 'testKey');
        });

    });

    describe('setOperationsPanelVisible', () => {

        it('setOperationsPanelVisible, panel is hidden', () => {
            controller.setOperationsPanelVisible(false);

            controller.setListMarkedKey('testKey');
            ok(controller.setOperationsPanelVisible(true) === 'testKey');
        });

    });
});
