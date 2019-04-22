import TileView = require('Controls/_tile/TileView/TileView');
import Env = require('Env/Env');
import {ItemTemplate as defaultItemTpl} from 'Controls/tile';
import itemOutputWrapper = require('wml!Controls/_tile/TreeTileView/resources/ItemOutputWrapper');
import 'css!theme?Controls/_tile/TreeTileView/TreeTileView';

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
