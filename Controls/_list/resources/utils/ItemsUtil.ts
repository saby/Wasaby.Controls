import displayLib = require('Types/display');
import cInstance = require('Core/core-instance');
import Utils = require('Types/util');

var ItemsUtil = {

    getDefaultDisplayFlat: function (items, cfg, filter) {
        var projCfg = {};
        projCfg.keyProperty = cfg.keyProperty;
        if (cfg.groupMethod) {
            projCfg.group = cfg.groupMethod;
        }
        if (cfg.groupingKeyCallback) {
            projCfg.group = cfg.groupingKeyCallback;
        }
        if (cfg.loadItemsStrategy === 'merge') {
            projCfg.unique = true;
        }
        projCfg.filter = filter;
        return displayLib.Abstract.getDefaultDisplay(items, projCfg);
    },

    getPropertyValue: function (itemContents, field) {
        if (!(itemContents instanceof Object)) {
            return itemContents;
        } else {
            return Utils.object.getPropertyValue(itemContents, field);
        }
    },

    //TODO это наверное к Лехе должно уехать
    getDisplayItemById: function (display, id, keyProperty) {
        var list = display.getCollection();
        if (cInstance.instanceOfModule(list, 'Types/collection:RecordSet')) {
            return display.getItemBySourceItem(list.getRecordById(id));
        } else {
            var resItem;
            display.each(function (item, i) {
                if (ItemsUtil.getPropertyValue(item.getContents(), keyProperty) == id) {
                    resItem = item;
                }
            });
            return resItem;
        }
    },

    getDefaultDisplayItem: function (display, item) {
        return display.createItem({contents: item});
    }
};
export = ItemsUtil;
