import {ItemsUtil} from 'Controls/list';
import getWidthUtil = require('Controls/Utils/getWidth');
import applyHighlighter = require('Controls/Utils/applyHighlighter');
import itemsTemplate = require('wml!Controls/_breadcrumbs/View/resources/itemsTemplate');
import itemTemplate = require('wml!Controls/_breadcrumbs/View/resources/itemTemplate');
import {Record} from "Types/entity";

var
    ARROW_WIDTH = 0,
    BREAD_CRUMB_MIN_WIDTH = 0,
    DOTS_WIDTH = 0,
    initialized,
    measurer;

var _private = {
   /* initializeConstants: function () {
        if (initialized) {
            return;
        }
        ARROW_WIDTH = getWidthUtil.getWidth('<span class="controls-BreadCrumbsView__arrow icon-size icon-DayForwardBsLine"></span>');
        BREAD_CRUMB_MIN_WIDTH = getWidthUtil.getWidth('<div class="controls-BreadCrumbsView__title_min"></div>') + ARROW_WIDTH;
        DOTS_WIDTH = getWidthUtil.getWidth(itemTemplate({
            itemData: {
                getPropValue: ItemsUtil.getPropertyValue,
                item: {
                    title: '...'
                },
                isDots: true,
                hasArrow: true
            },
            displayProperty: 'title'
        }));
        initialized = true;
    },*/

    getItemData: function (index, items, withOverflow = false) {
        var
            currentItem = items[index],
            count = items.length;
        return {
            getPropValue: ItemsUtil.getPropertyValue,
            item: currentItem,
            hasArrow: count > 1 && index !== 0,
            withOverflow: withOverflow
        };
    }

 /*   getMeasurer: function():HTMLElement {
        //create measurer once on page
        if (!measurer) {
            measurer = document.createElement('div');
            measurer.classList.add('controls-BreadCrumbsView__measurer');
            measurer.style.cssText = 'position:absolute;overflow:hidden;visibility:hidden;top:-10000px;left:-10000px';
            measurer.setAttribute('data-vdom-ignore', true);
            measurer.setAttribute('ws-no-focus', true);
            document.body.appendChild(measurer);
        }
        return measurer;
    },

    getItemsSizes: function (items:Array<Record>, displayProperty:String):Array<number> {
        let itemsSizes:Array<number> = [];
        let measurer = _private.getMeasurer();

        measurer.innerHTML = itemsTemplate({
            itemTemplate: itemTemplate,
            displayProperty: displayProperty,
            applyHighlighter: applyHighlighter,
            items: items.map(function (item, index) {
                return _private.getItemData(index, items);
            })
        });

        [].forEach.call(measurer.getElementsByClassName('controls-BreadCrumbsView__crumb'), function (item) {
            itemsSizes.push(item.clientWidth);
        });

        return itemsSizes;
    },

    canShrink: function (itemWidth, currentWidth, availableWidth) {
        return itemWidth > BREAD_CRUMB_MIN_WIDTH && currentWidth - itemWidth + BREAD_CRUMB_MIN_WIDTH < availableWidth;
    }*/
};

export default {
    calculateBreadCrumbsToDraw: function (self, items) {
        self._visibleItems = [];
            self._visibleItems = items.map(function (item, index, items) {
                return _private.getItemData(index, items);
            });
    },
/*
    getMaxCrumbsWidth: function (items, displayProperty) {
        _private.initializeConstants();

        return _private.getItemsSizes(items, displayProperty).reduce(function (acc, width) {
            return acc + width;
        }, 0);
    },

    getMinCrumbsWidth(itemsCount: number): number {
        _private.initializeConstants();
        if (itemsCount > 2) {
            return BREAD_CRUMB_MIN_WIDTH * 2 + DOTS_WIDTH;
        } else {
            return itemsCount * BREAD_CRUMB_MIN_WIDTH - ARROW_WIDTH;
        }
    },

    shouldRedraw: function (currentItems, newItems, oldWidth, availableWidth) {
        return currentItems !== newItems || oldWidth !== availableWidth;
    }

 */
};
