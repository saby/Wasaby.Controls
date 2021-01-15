import {assert} from 'chai';
import {useFakeTimers} from 'sinon';

import { SyntheticEvent } from 'UI/Vdom';

import {IBaseCollection} from 'Controls/_display/interface';
import {ICollectionItem} from 'Controls/_display/interface/ICollectionItem';

import HoverFreeze, {IHoverFreezeOptions} from 'Controls/_list/Controllers/HoverFreeze';

// const + 1
const TEST_HOVER_FREEZE_TIMEOUT: number = 201;
const TEST_HOVER_UNFREEZE_TIMEOUT: number = 51;

function createFakeMouseEvent(clientX: number, clientY: number): SyntheticEvent {
    return {
        nativeEvent: {
            clientX,
            clientY
        }
    };
}

describe('Controls/list/HoverFreeze', () => {
    let cfg: IHoverFreezeOptions;
    let hoverContainerRect: {top: number, left: number, width: number, height: number};
    let itemActionsHeight: number;
    let clock: any;
    let hoverFreeze: HoverFreeze;
    let key: string;
    let isFreezeHoverCallbackCalled: boolean;
    let isUnFreezeHoverCallbackCalled: boolean;

    function createFakeItem(): ICollectionItem {
        return {
            getContents: () => ({
                getKey: () => key
            })
        } as undefined as ICollectionItem;
    }

    before(() => {
        const isNode = typeof document === 'undefined';
        if (isNode) {
            global.getComputedStyle = () => ({});
        }
    });

    beforeEach(() => {
        isFreezeHoverCallbackCalled = false;
        isUnFreezeHoverCallbackCalled = false;
        clock = useFakeTimers();
        hoverContainerRect = {
            top: 25,
            left: 25,
            height: 30,
            width: 100
        };
        itemActionsHeight = 30;
        cfg = {
            collection: {
                getItemHoveredContainerSelector: () => '.selector',
                getDisplayItemActionsOutsideStyles: () => '',
                getItemFreezeHoverStyles: () => '',
                getIndex: () => 0
            } as undefined as IBaseCollection<any, any>,
            viewContainer: {
                querySelectorAll: () => ([
                    {
                        querySelector: () => ({
                            offsetHeight: itemActionsHeight
                        }),
                        getBoundingClientRect: () => hoverContainerRect
                    } as undefined as HTMLElement
                ])
            } as undefined as HTMLElement,
            stylesContainer: {
                innerHTML: ''
            } as undefined as HTMLElement,
            uniqueClass: 'unique-class',
            freezeHoverCallback: () => {
                isFreezeHoverCallbackCalled = true;
            },
            unFreezeHoverCallback: () => {
                isUnFreezeHoverCallbackCalled = true;
            }
        };
        hoverFreeze =  new HoverFreeze(cfg);
        key = 'key_1';
    });

    afterEach(() => {
        clock.restore();
    });

    it('should start freeze timer', () => {
        hoverFreeze.startFreezeHoverTimeout(createFakeItem());

        // until timer stops it must not be frozen
        assert.notEqual(hoverFreeze.getCurrentItemKey(), key);
        clock.tick(TEST_HOVER_FREEZE_TIMEOUT);
        assert.equal(hoverFreeze.getCurrentItemKey(), key);
    });

    it('should freeze only the last key', () => {
        hoverFreeze.startFreezeHoverTimeout(createFakeItem());
        clock.tick(TEST_HOVER_FREEZE_TIMEOUT / 2);
        key = 'key_2';
        hoverFreeze.startFreezeHoverTimeout(createFakeItem());
        clock.tick(TEST_HOVER_FREEZE_TIMEOUT / 2);
        key = 'key_3';
        hoverFreeze.startFreezeHoverTimeout(createFakeItem());
        assert.notEqual(hoverFreeze.getCurrentItemKey(), key);

        // until timer stops it must not be frozen
        clock.tick(TEST_HOVER_FREEZE_TIMEOUT);
        assert.equal(hoverFreeze.getCurrentItemKey(), 'key_3');
    });

    it('should start unfreeze timer when cursor position is in bottom of the moveArea', () => {
        // mouse cursor position is in bottom of the moveArea
        const event = createFakeMouseEvent(100, 80);
        hoverFreeze.startFreezeHoverTimeout(createFakeItem());
        clock.tick(TEST_HOVER_FREEZE_TIMEOUT);
        hoverFreeze.startUnfreezeHoverTimeout(event);

        // until timer stops it must not be unfrozen
        assert.equal(hoverFreeze.getCurrentItemKey(), key);
        clock.tick(TEST_HOVER_UNFREEZE_TIMEOUT);
        assert.equal(hoverFreeze.getCurrentItemKey(), null);
    });

    it('should not start unfreeze timer when cursor position is under the moveArea', () => {
        // mouse cursor position is under the moveArea
        const event = createFakeMouseEvent(100, 100);
        hoverFreeze.startFreezeHoverTimeout(createFakeItem());
        clock.tick(TEST_HOVER_FREEZE_TIMEOUT);
        hoverFreeze.startUnfreezeHoverTimeout(event);

        // it must be unfrozen immediately
        assert.equal(hoverFreeze.getCurrentItemKey(), null);
    });

    it('should restart unfreeze timer', () => {
        // mouse cursor is moving right inside of the moveArea
        const event1 = createFakeMouseEvent(80, 80);
        const event2 = createFakeMouseEvent(90, 80);
        const event3 = createFakeMouseEvent(100, 80);
        hoverFreeze.startFreezeHoverTimeout(createFakeItem());
        clock.tick(TEST_HOVER_FREEZE_TIMEOUT);
        hoverFreeze.startUnfreezeHoverTimeout(event1);
        clock.tick(TEST_HOVER_UNFREEZE_TIMEOUT / 2);
        hoverFreeze.startUnfreezeHoverTimeout(event2);
        clock.tick(TEST_HOVER_UNFREEZE_TIMEOUT / 2);
        hoverFreeze.startUnfreezeHoverTimeout(event3);

        // until timer stops it must not be unfrozen
        assert.equal(hoverFreeze.getCurrentItemKey(), key);
        clock.tick(TEST_HOVER_UNFREEZE_TIMEOUT);
        assert.equal(hoverFreeze.getCurrentItemKey(), null);
    });

    it ('should call freezeHoverCallback', () => {
        hoverFreeze.startFreezeHoverTimeout(createFakeItem());
        assert.isFalse(isFreezeHoverCallbackCalled);
        clock.tick(TEST_HOVER_FREEZE_TIMEOUT);
        assert.isTrue(isFreezeHoverCallbackCalled);
    });

    it ('should call unFreezeHoverCallback when cursor position is in bottom of the moveArea', () => {
        hoverFreeze.startFreezeHoverTimeout(createFakeItem());
        clock.tick(TEST_HOVER_FREEZE_TIMEOUT);

        const event = createFakeMouseEvent(100, 80);
        hoverFreeze.startUnfreezeHoverTimeout(event);
        assert.isFalse(isUnFreezeHoverCallbackCalled);
        clock.tick(TEST_HOVER_UNFREEZE_TIMEOUT);
        assert.isTrue(isUnFreezeHoverCallbackCalled);
    });

    it ('should call unFreezeHoverCallback when cursor position is under the moveArea', () => {
        hoverFreeze.startFreezeHoverTimeout(createFakeItem());
        clock.tick(TEST_HOVER_FREEZE_TIMEOUT);

        // mouse cursor position is under the moveArea
        const event = createFakeMouseEvent(100, 100);
        hoverFreeze.startUnfreezeHoverTimeout(event);
        assert.isTrue(isUnFreezeHoverCallbackCalled);
    });
});
