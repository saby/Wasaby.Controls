import { assert } from 'chai';
import { stub, SinonStub, mock } from 'sinon';
import { MeasurerUtils } from 'Controls/_itemActions/measurers/MeasurerUtils';
import { IItemAction } from 'Controls/_itemActions/interface/IItemActions';

describe('Controls/_itemActions/measurers/MeasurerUtils', () => {
    it('getActualActions', () => {
        const actions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull'
            },
            {
                id: 2,
                icon: 'icon-Erase'
            },
            {
                id: 3,
                icon: 'icon-EmptyMessage',
                parent: 1
            },
            {
                id: 4,
                icon: 'icon-PhoneNull',
                parent: 1
            },
            {
                id: 5,
                icon: 'icon-Erase',
                showType: 2
            },
            {
                id: 6,
                icon: 'icon-EmptyMessage',
                showType: 0
            }
        ];
        const actual: IItemAction[] = [
            {
                id: 5,
                icon: 'icon-Erase',
                showType: 2
            },
            {
                id: 1,
                icon: 'icon-PhoneNull'
            },
            {
                id: 2,
                icon: 'icon-Erase'
            },
            {
                id: 6,
                icon: 'icon-EmptyMessage',
                showType: 0
            }
        ];
        const result = MeasurerUtils.getActualActions(actions);
        assert.deepEqual(actual, result);
    });

    describe('calculateSizesOfItems()', () => {

        // Метод должен правильно считать размеры элементов и отступы их родительского контейнера
        it ('should return object with sizes', () => {
            const isNode = typeof document === 'undefined';
            if (isNode) {
                global.document = {
                    body: {
                        appendChild: () => {},
                        removeChild: () => {}
                    },
                    createElement: () => {}
                };
                global.window = {
                    getComputedStyle: () => {}
                };
            }
            const createElementStub = stub(document, 'createElement');
            const fakeChild = {
                // @ts-ignore
                clientWidth: 123
            };
            function ClassList(): void {};
            ClassList.prototype = [];
            // @ts-ignore
            ClassList.prototype.add = ClassList.prototype.push;
            const fakeElement = {
                innerHTML: '',
                // @ts-ignore
                classList: new ClassList(),
                getElementsByClassName: () => [fakeChild, fakeChild]
            };
            // @ts-ignore
            createElementStub.withArgs('div').returns(fakeElement);
            const appendChildStub = stub(document.body, 'appendChild');
            const removeChildStub = stub(document.body, 'removeChild');
            const getComputedStyleStub = stub(window, 'getComputedStyle');
            // @ts-ignore
            getComputedStyleStub.withArgs(fakeElement).returns({
                paddingLeft: '5px',
                paddingRight: '0px',
                marginLeft: '0px',
                marginRight: '0px'
            });
            // @ts-ignore
            getComputedStyleStub.withArgs(fakeChild).returns({
                paddingLeft: '0px',
                paddingRight: '0px',
                marginLeft: '2px',
                marginRight: '2px'
            });

            const result = MeasurerUtils.calculateSizesOfItems(
                ['<div class="items-class">1</div>', '<div class="items-class">2</div>'],
                'measurer-block-class',
                'items-class');

            createElementStub.restore();
            appendChildStub.restore();
            removeChildStub.restore();
            getComputedStyleStub.restore();

            if (isNode) {
                global.document = undefined;
                global.window = undefined;
            }

            assert.equal(result.blockSize, 5);
            assert.deepEqual(result.itemsSizes, [127, 127]);
        });
    });
});
