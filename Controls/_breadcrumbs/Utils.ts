import {ItemsUtil} from 'Controls/list';

export default {
    drawBreadCrumbs: function (self, items) {
        self._visibleItems = [];
            self._visibleItems = items.map(function (item, index, items) {
                return this.getItemData(index, items);
            });
    },
    shouldRedraw: function (currentItems, newItems) {
        return currentItems !== newItems;
    },
    getItemData: function (index, items, arrow?: boolean = false, withOverflow?: boolean = false) {
        var
            currentItem = items[index],
            count = items.length;
        return {
            getPropValue: ItemsUtil.getPropertyValue,
            item: currentItem,
            hasArrow: count > 1 && index !== 0 || arrow,
            withOverflow
        };
    },
    drawBreadCrumbsItems: function (items, arrow? = false) {
        let visibleItems = [];
        visibleItems = items.map((item, index, items) => {
            return this.getItemData(index, items, arrow);
        });
        return visibleItems;
    }

};
