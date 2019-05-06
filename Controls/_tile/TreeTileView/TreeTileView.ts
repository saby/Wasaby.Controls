import TileView = require('Controls/_tile/TileView/TileView');
import Env = require('Env/Env');
import defaultItemTpl = require('wml!Controls/_tile/TreeTileView/DefaultItemTpl');
import 'css!theme?Controls/tile';

var TreeTileView = TileView.extend({
    _defaultItemTemplate: defaultItemTpl,
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
