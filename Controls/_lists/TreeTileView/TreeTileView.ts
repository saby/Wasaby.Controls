import TileView = require('Controls/List/TileView/TileView');
import Env = require('Env/Env');
import defaultItemTpl = require('wml!Controls/_lists/TreeTileView/DefaultItemTpl');
import itemOutputWrapper = require('wml!Controls/_lists/TreeTileView/resources/ItemOutputWrapper');
import 'css!theme?Controls/List/TreeTileView/TreeTileView';

var TreeTileView = TileView.extend({
    _defaultItemTemplate: defaultItemTpl,
    _itemOutputWrapper: itemOutputWrapper,
    _onTileViewKeyDown: function (event) {
        // Pressing the left or right key allows you to expand / collapse an element.
        // In tileView mode, expand/collapse is not allowed.
        if (event.nativeEvent.keyCode === Env.constants.key.right || event.nativeEvent.keyCode === Env.constants.key.left) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }
    }
});

export = TreeTileView;
