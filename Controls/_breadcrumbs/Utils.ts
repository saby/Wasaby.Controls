import {ItemsUtil} from 'Controls/list';
import applyHighlighter = require('Controls/Utils/applyHighlighter');
import itemsTemplate = require('wml!Controls/_breadcrumbs/View/resources/itemsTemplate');
import itemTemplate = require('wml!Controls/_breadcrumbs/View/resources/itemTemplate');
import {Record} from "Types/entity";


var _private = {
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
};

export default {
    drawBreadCrumbs: function (self, items) {
        self._visibleItems = [];
            self._visibleItems = items.map(function (item, index, items) {
                return _private.getItemData(index, items);
            });
    }
};
