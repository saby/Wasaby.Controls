import display = require('Types/display');
import {TreeItemsUtil} from 'Controls/list';

var
    SearchItemsUtil = {
        getDefaultDisplaySearch: function (items, cfg, filter) {
            return new display.Search(TreeItemsUtil.prepareDisplayProperties(items, cfg, filter));
        }
    };
export = SearchItemsUtil;
