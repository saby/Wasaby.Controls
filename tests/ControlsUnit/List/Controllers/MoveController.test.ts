import {assert} from 'chai';
import {stub, spy, assert as sinonAssert} from 'sinon';

import * as clone from 'Core/core-clone';
import { Memory } from 'Types/source';
import {IMoveControllerOptions, MoveController} from 'Controls/list';

const data = [{
    id: 1,
    folder: null,
    'folder@': true
}, {
    id: 2,
    folder: null,
    'folder@': null
}, {
    id: 3,
    folder: null,
    'folder@': null
}, {
    id: 4,
    folder: 1,
    'folder@': true
}, {
    id: 5,
    folder: 1,
    'folder@': null
}, {
    id: 6,
    folder: null,
    'folder@': null
}];

describe('Controls/_list/Controllers/MoveController', () => {
    let controller;
    let cfg: IMoveControllerOptions;
    let source: Memory;

    beforeEach(() => {
        const _data = clone(data);

        source = new Memory({
            keyProperty: 'id',
            data: _data
        });

        cfg = {
            parentProperty: 'folder',
            source,
            popupOptions: {
                // @ts-ignore
                template: () => ({}),
            }
        }
        controller = new MoveController(cfg);
    });

    // Метод move() должен вызвать метод ресурса move с position before, after, on
    it ('move() should call ICrudPlus.move() method with given position');

    // Метод move() должен вызывать метод IRpc-ресурса call с filter и selected
    it ('move() should call IRpc.call() method with given filter');

    // Метод moveWithDialog() Не должен перемещать пустые записи, должен вернуть reject
    it ('moveWithDialog() should reject Promise when no items were given');

    // Метод moveWithDialog Должен вызывать _moveInSource и вернуть его результат
    it ('moveWithDialog() should call _moveInSource and return its result');
});
