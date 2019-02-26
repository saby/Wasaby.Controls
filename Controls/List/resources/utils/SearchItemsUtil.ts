import display = require('Types/display');

var
    TreeItemsUtil = {
        getDefaultDisplaySearch: function (items, cfg, filter) {
            var
                displayProperties = {
                    collection: items,
                    idProperty: cfg.keyProperty,
                    parentProperty: cfg.parentProperty,
                    nodeProperty: cfg.nodeProperty,
                    unique: true,
                    filter: filter,
                    root: null
                };
            return new display.Search(displayProperties);
        }
    };
export = TreeItemsUtil;
