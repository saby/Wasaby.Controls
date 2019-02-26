import display = require('Types/display');
import entity = require('Types/entity');
import isPlainObject = require('Core/helpers/Object/isPlainObject');

var
    _private = {},
    TreeItemsUtil = {
        getDefaultDisplayTree: function (items, cfg, filter) {
            var
                displayProperties = {
                    collection: items,
                    idProperty: cfg.keyProperty,
                    parentProperty: cfg.parentProperty,
                    nodeProperty: cfg.nodeProperty,
                    loadedProperty: '!' + cfg.parentProperty + '$',
                    unique: cfg.loadItemsStrategy === 'merge',
                    filter: filter,
                    sort: cfg.itemsSortMethod
                },
                root, rootAsNode;

            if (cfg.groupMethod) {
                displayProperties.group = cfg.groupMethod;
            }

            if (cfg.groupingKeyCallback) {
                displayProperties.group = cfg.groupingKeyCallback;
            }

            if (typeof cfg.root !== 'undefined') {
                root = cfg.root;
            } else {
                root = null;
            }
            rootAsNode = isPlainObject(root);
            if (rootAsNode) {
                root = entity.Model.fromObject(root, 'Types/entity:adapter.Sbis');
                root.keyProperty = cfg.keyProperty;
                displayProperties.rootEnumerable = true;
            }
            displayProperties.root = root;

            return new display.Tree(displayProperties);
        }
    };
export = TreeItemsUtil;
