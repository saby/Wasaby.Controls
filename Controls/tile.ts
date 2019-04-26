/**
 * tile library
 * @library Controls/tile
 * @includes View Controls/_tile/View
 * @includes ItemTemplate wml!Controls/_tile/TreeTileView/DefaultItemTpl
 * @includes TileStyles Controls/_tile/Tile/Styles
 * @includes TreeTileViewStyles Controls/_tile/TreeTileView/Styles
 * @includes ITile Controls/_tile/interface/ITile
 * @public
 * @author Kraynov D.
 */

import View = require('Controls/_tile/View');
import ItemTemplate = require('wml!Controls/_tile/TreeTileView/DefaultItemTpl');

import TreeViewModel = require('Controls/_tile/TreeTileView/TreeTileViewModel');
import TreeView = require('Controls/_tile/TreeTileView/TreeTileView');

export {
   View,
   ItemTemplate,

   TreeViewModel,
   TreeView
}
