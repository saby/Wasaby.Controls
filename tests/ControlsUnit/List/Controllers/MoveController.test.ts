import {assert} from 'chai';
import {spy, stub, assert as sinonAssert} from 'sinon';

import {Logger} from 'UI/Utils';
import {Control} from 'UI/Base';
import {IHashMap} from 'Types/declarations';

import * as clone from 'Core/core-clone';
import {CrudEntityKey, DataSet, Memory, SbisService} from 'Types/source';
import {IMoveControllerOptions, MoveController, TMovePosition} from 'Controls/list';
import {ISelectionObject} from 'Controls/interface';
import {Dialog, IBasePopupOptions} from 'Controls/popup';
import {Model, adapter, Record} from 'Types/entity';
import {IMoverDialogTemplateOptions} from 'Controls/moverDialog';

const data = [
    {
        id: 1,
        folder: null,
        'folder@': true
    },
    {
        id: 2,
        folder: null,
        'folder@': null
    },
    {
        id: 3,
        folder: null,
        'folder@': null
    },
    {
        id: 4,
        folder: 1,
        'folder@': true
    },
    {
        id: 5,
        folder: 1,
        'folder@': null
    },
    {
        id: 6,
        folder: null,
        'folder@': null
    }
];

const sbisServiceSource: Partial<SbisService> = {
    getAdapter(): any {
        return new adapter.Json();
    },
    getBinding(): any {
        return {
            move: 'move',
            list: 'list'
        }
    },
    move(items: CrudEntityKey[], target: CrudEntityKey, meta?: IHashMap<any>): Promise<void> {
        return Promise.resolve();
    },
    call(command: string, data?: object): Promise<DataSet> {
        return Promise.resolve(undefined);
    }
}

function createFakeModel(rawData: {id: number, folder: number, 'folder@': boolean}) {
    return new Model({
        rawData,
        keyProperty: 'id'
    });
}

describe('Controls/list_clean/MoveController', () => {
    let controller;
    let cfg: IMoveControllerOptions;
    let source: Memory;
    let stubLoggerError: any;
    let validPopupArgs: IBasePopupOptions;
    let selectionObject: ISelectionObject;

    beforeEach(() => {
        const _data = clone(data);

        // fake opener
        const opener = new Control({});

        source = new Memory({
            keyProperty: 'id',
            data: _data
        });

        selectionObject = {
            selected: [1, 3, 5, 7],
            excluded: [3]
        };

        validPopupArgs = {
            opener,
            templateOptions: {
            source,
                movedItems: selectionObject.selected,
                keyProperty: 'id',
                nodeProperty: 'folder@',
                parentProperty: 'folder',
            } as Partial<IMoverDialogTemplateOptions>,
            closeOnOutsideClick: true,
            template: 'fakeTemplate'
        };

        cfg = {
            parentProperty: 'folder',
            source,
            popupOptions: {
                opener: validPopupArgs.opener,
                templateOptions: {
                    keyProperty: (validPopupArgs.templateOptions as IMoverDialogTemplateOptions).keyProperty,
                    nodeProperty: (validPopupArgs.templateOptions as IMoverDialogTemplateOptions).nodeProperty,
                    parentProperty: (validPopupArgs.templateOptions as IMoverDialogTemplateOptions).parentProperty
                },
                template: validPopupArgs.template
            }
        };

        // to prevent throwing console error
        stubLoggerError = stub(Logger, 'error').callsFake((message, errorPoint, errorInfo) => ({}));
    });

    afterEach(() => {
        stubLoggerError.restore();
    })

    describe('constructor', () => {

        // move + invalid source
        it('move() + source is not set/invalid', () => {
            // calling controller constructor
            controller = new MoveController({...cfg, source: undefined});

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .move(selectionObject, {myProp: 'test'}, 4, TMovePosition.after)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю, что перемещение провалится из-за того, что source не задан
                sinonAssert.called(stubLoggerError);
                assert.isFalse(result);
            });
        });

        // moveWithDialog + invalid source
        it('moveWithDialog() + source is not set/invalid', () => {
            // to prevent popup open
            const stubDialog = stub(Dialog, 'openPopup').callsFake((args) => (
                Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])))
            ))

            // calling controller constructor
            controller = new MoveController({...cfg, source: undefined});

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .moveWithDialog(selectionObject, {myProp: 'test'})
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю, что перемещение провалится из-за того, что source не задан
                sinonAssert.called(stubLoggerError);
                assert.isFalse(result);

                stubDialog.restore();
            });
        });

        // moveWithDialog + invalid popupOptions (no template)
        it('moveWithDialog() + popupOptions.template is not set', () => {
            // to prevent popup open
            const stubDialog = stub(Dialog, 'openPopup').callsFake((args) => (
                Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])))
            ))

            // calling controller constructor
            controller = new MoveController({...cfg, popupOptions: {}});

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .moveWithDialog(selectionObject, {myProp: 'test'})
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю, что перемещение провалится из-за некорректно заданного шаблона
                sinonAssert.called(stubLoggerError);
                assert.isFalse(result);

                stubDialog.restore();
            });
        });

        // moveWithDialog + necessary and static popupOptions
        it('moveWithDialog() + necessary and static popupOptions', () => {
            const stubDialog = stub(Dialog, 'openPopup').callsFake((args) => {
                assert.equal(args.opener, validPopupArgs.opener, 'opener is invalid');

                assert.deepEqual(args.templateOptions, validPopupArgs.templateOptions, 'templateOptions are invalid');

                assert.equal(args.closeOnOutsideClick, validPopupArgs.closeOnOutsideClick, 'closeOnOutsideClick should be true');

                assert.equal(args.template, validPopupArgs.template, 'template is not the same as passed');

                return Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])));
            });

            // calling controller constructor
            controller = new MoveController({
                ...cfg,
                popupOptions: {
                    opener: validPopupArgs.opener,
                    templateOptions: {
                        keyProperty: (validPopupArgs.templateOptions as IMoverDialogTemplateOptions).keyProperty,
                        nodeProperty: (validPopupArgs.templateOptions as IMoverDialogTemplateOptions).nodeProperty,
                        parentProperty: (validPopupArgs.templateOptions as IMoverDialogTemplateOptions).parentProperty
                    },
                    template: validPopupArgs.template
                }
            });

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .moveWithDialog(selectionObject, {myProp: 'test'})
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                sinonAssert.notCalled(stubLoggerError);
                assert.isTrue(result);

                stubDialog.restore();
            });
        });

        // moveWithDialog + parentProperty is not set
        // Случай, когда movePosition === on, parentProperty === undefined, и source instanceof Memory
        it('moveWithDialog() + _parentProperty is not set', () => {
            // to prevent popup open
            const stubDialog = stub(Dialog, 'openPopup').callsFake((args) => (
                Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])))
            ))

            // calling controller constructor
            controller = new MoveController({...cfg, parentProperty: undefined});

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .moveWithDialog(selectionObject, {myProp: 'test'})
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение провалится из-за ошибки, брошенной в source
                assert.isFalse(result);

                stubDialog.restore();
            });
        });
    });

    describe('update', () => {
        // move + invalid source / change
        it('move() + source set via update()', () => {
            // calling controller constructor
            controller = new MoveController({...cfg, source: undefined});
            // calling update method
            controller.update({...cfg, source});

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .move(selectionObject, {myProp: 'test'}, 4, TMovePosition.after)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                assert.isTrue(result);
            });
        });

        // moveWithDialog + invalid source / change
        it('moveWithDialog() + source set via update', () => {
            // to prevent popup open
            const stubDialog = stub(Dialog, 'openPopup').callsFake((args) => (
                Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])))
            ))

            // calling controller constructor
            controller = new MoveController({...cfg, source: undefined});
            // calling update method
            controller.update({...cfg, source});

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .moveWithDialog(selectionObject, {myProp: 'test'})
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                assert.isTrue(result);

                stubDialog.restore();
            });
        });

        // moveWithDialog + template set via update
        it('moveWithDialog() + popupOptions.template set via update', () => {
            // to prevent popup open
            const stubDialog = stub(Dialog, 'openPopup').callsFake((args) => (
                Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])))
            ))

            // calling controller constructor
            controller = new MoveController({...cfg, popupOptions: {}});
            // calling update method
            controller.update({...cfg, popupOptions: { template: 'anyNewTemplate' }});

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .moveWithDialog(selectionObject, {myProp: 'test'})
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                assert.isTrue(result);

                stubDialog.restore();
            });
        });

        // moveWithDialog + necessary and static popupOptions
        it('moveWithDialog() + necessary and static popupOptions set via update', () => {
            const stubDialog = stub(Dialog, 'openPopup').callsFake((args) => {
                assert.equal(args.opener, validPopupArgs.opener, 'opener is invalid');

                assert.deepEqual(args.templateOptions, validPopupArgs.templateOptions, 'templateOptions are invalid');

                assert.equal(args.closeOnOutsideClick, validPopupArgs.closeOnOutsideClick, 'closeOnOutsideClick should be true');

                assert.equal(args.template, validPopupArgs.template, 'template is not the same as passed');

                return Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])));
            });

            // calling controller constructor
            controller = new MoveController(cfg);
            // calling update method
            controller.update({
                ...cfg,
                popupOptions: {
                    opener: validPopupArgs.opener,
                    templateOptions: {
                        keyProperty: (validPopupArgs.templateOptions as IMoverDialogTemplateOptions).keyProperty,
                        nodeProperty: (validPopupArgs.templateOptions as IMoverDialogTemplateOptions).nodeProperty,
                        parentProperty: (validPopupArgs.templateOptions as IMoverDialogTemplateOptions).parentProperty
                    },
                    template: validPopupArgs.template
                }
            });

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .moveWithDialog(selectionObject, {myProp: 'test'})
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                assert.isTrue(result);

                stubDialog.restore();
            });
        });

        // moveWithDialog + invalid _parentProperty / change
        it('moveWithDialog() + _parentProperty is set via update', () => {
            // to prevent popup open
            const stubDialog = stub(Dialog, 'openPopup').callsFake((args) => (
                Promise.resolve(args.eventHandlers.onResult(createFakeModel(data[3])))
            ))

            // calling controller constructor
            controller = new MoveController({...cfg, parentProperty: undefined});
            // calling update method
            controller.update(cfg);

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .moveWithDialog(selectionObject, {myProp: 'test'})
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                assert.isTrue(result);

                stubDialog.restore();
            });
        });
    });

    describe('SbisService', () => {
        beforeEach(() => {
            controller = new MoveController({...cfg, source: (sbisServiceSource as SbisService)});
        });

        // move + invalid selection
        it ('should not move with invalid selection', () => {
            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .move(['1', '2', '2'], {myProp: 'test'}, 4, TMovePosition.after)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение провалится из-за ошибки, брошенной в контроллере
                sinonAssert.called(stubLoggerError);
                assert.isFalse(result);
            });
        });

        // move - selection
        it ('should not move with undefined selection', () => {
            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .move(undefined, {myProp: 'test'}, 4, TMovePosition.after)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение провалится из-за ошибки, брошенной в контроллере
                sinonAssert.called(stubLoggerError);
                assert.isFalse(result);
            });
        });

        // move + empty selection
        it ('should try to move after with empty selection', () => {
            const emptySelectionObject: ISelectionObject = {
                selected: [],
                excluded: []
            }
            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .move(emptySelectionObject, {myProp: 'test'}, 4, TMovePosition.after)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                sinonAssert.notCalled(stubLoggerError);
                assert.isTrue(result);
            });
        });

        // move + selected + excluded
        it ('should try to move after with correct selection', () => {
            const correctSelection: ISelectionObject = {
                selected: [1, 3, 5, 7],
                excluded: [3]
            };

            const stubCall = stub(sbisServiceSource, 'call')
                .callsFake((command: string, data?: { method: string, filter: Record, folder_id: number }) => {
                    assert.exists(data.filter, 'filter should exist');
                    assert.deepEqual(data.filter.get('selection').get('marked'), correctSelection.selected.map((key) => `${key}`));
                    assert.deepEqual(data.filter.get('selection').get('excluded'), correctSelection.excluded.map((key) => `${key}`));
                    return Promise.resolve({} as DataSet);
                });
            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .move(correctSelection, {myProp: 'test'}, 4, TMovePosition.on)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                sinonAssert.notCalled(stubLoggerError);
                assert.isTrue(result);
                stubCall.restore();
            });
        });

        // move - selected + excluded
        it ('should try to move without selected keys', () => {
            const correctSelection: ISelectionObject = {
                selected: [],
                excluded: [3]
            };
            const stubCall = stub(sbisServiceSource, 'call')
                .callsFake((command: string, data?: { method: string, filter: Record, folder_id: number }) => {
                    assert.exists(data.filter, 'filter should exist');
                    assert.deepEqual(data.filter.get('selection').get('marked'), correctSelection.selected.map((key) => `${key}`));
                    assert.deepEqual(data.filter.get('selection').get('excluded'), correctSelection.excluded.map((key) => `${key}`));
                    return Promise.resolve({} as DataSet);
                });

            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .move(correctSelection, {myProp: 'test'}, 4, TMovePosition.on)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                sinonAssert.notCalled(stubLoggerError);
                assert.isTrue(result);
                stubCall.restore();
            });
        });

        // move + selected - excluded
        it ('should try to move without excluded keys', () => {
            const correctSelection: ISelectionObject = {
                selected: [1, 3, 5, 7],
                excluded: []
            };
            const stubCall = stub(sbisServiceSource, 'call')
                .callsFake((command: string, data?: { method: string, filter: Record, folder_id: number }) => {
                    assert.exists(data.filter, 'filter should exist');
                    assert.deepEqual(data.filter.get('selection').get('marked'), correctSelection.selected.map((key) => `${key}`));
                    assert.deepEqual(data.filter.get('selection').get('excluded'), correctSelection.excluded.map((key) => `${key}`));
                    return Promise.resolve({} as DataSet);
                });
            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .move(correctSelection, {myProp: 'test'}, 4, TMovePosition.on)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                sinonAssert.notCalled(stubLoggerError);
                assert.isTrue(result);
                stubCall.restore();
            });
        });

        // move + invalid target
        it ('should not move to undefined target', () => {
            // const correctSelection: ISelectionObject = {
            //     selected: [1, 3, 5, 7],
            //     excluded: []
            // };
            // const stubCall = stub(sbisServiceSource, 'call')
            //     .callsFake((command: string, data?: { method: string, filter: Record, folder_id: number }) => {
            //         assert.exists(data.filter, 'filter should exist');
            //         assert.deepEqual(data.filter.get('selection').get('marked'), correctSelection.selected.map((key) => `${key}`));
            //         assert.deepEqual(data.filter.get('selection').get('excluded'), correctSelection.excluded.map((key) => `${key}`));
            //         return Promise.resolve({} as DataSet);
            //     });
            // // Promise to get all expected results in one place
            // return new Promise((resolve) => {
            //     controller
            //         .move(correctSelection, {myProp: 'test'}, undefined, TMovePosition.on)
            //         .then(() => resolve(true))
            //         .catch(() => resolve(false));
            // }).then((result: boolean) => {
            //
            //     // Ожидаю. что перемещение провалится из-за ошибки, брошенной в контроллере
            //     sinonAssert.called(stubLoggerError);
            //     assert.isFalse(result);
            //     stubCall.restore();
            // });
        });

        // move + invalid filter


        // move + invalid position



        // move - filter

        // move + (target === null)

        // move - target

        // move - position

        // move + position:on

        // move + position:after

        // move + position:before

        // move + invalid parentProperty

        // moveWithDialog + invalid selection

        // moveWithDialog + invalid filter

        // moveWithDialog - selection

        // moveWithDialog + selected + excluded

        // moveWithDialog - selected + excluded

        // moveWithDialog + selected - excluded

        // moveWithDialog - filter

        // moveWithDialog + filter

        // moveWithDialog + invalid _parentProperty

        // const stubMove = stub(sbisServiceSource, 'move');
        // stubMove.callsFake((items: CrudEntityKey[], target: CrudEntityKey, meta?: CrudEntityKey) => {
        //     assert.notExists(items);
        //     return Promise.resolve();
        // })
    });

    describe('ICrudPlus', () => {
        // move + invalid selection
        it ('should not move with invalid selection', () => {
            // Promise to get all expected results in one place
            return new Promise((resolve) => {
                controller
                    .move(['1', '2', '2'], {myProp: 'test'}, 4, TMovePosition.after)
                    .then(() => resolve(true))
                    .catch(() => resolve(false));
            }).then((result: boolean) => {

                // Ожидаю. что перемещение провалится из-за ошибки, брошенной в контроллере
                sinonAssert.called(stubLoggerError);
                assert.isFalse(result);
            });
        });

        // move + invalid filter

        // move + invalid target

        // move + invalid position

        // move - selection

        // move + selected + excluded

        // move - selected + excluded

        // move + selected - excluded

        // move - filter

        // move + (target === null)

        // move - target

        // move - position

        // move + position:on

        // move + position:after

        // move + position:before

        // move + invalid parentProperty

        // moveWithDialog + invalid selection

        // moveWithDialog + invalid filter

        // moveWithDialog - selection

        // moveWithDialog + selected + excluded

        // moveWithDialog - selected + excluded

        // moveWithDialog + selected - excluded

        // moveWithDialog - filter

        // moveWithDialog + filter

        // moveWithDialog + invalid _parentProperty

        // moveWithDialog + target is out of source
    });
});
