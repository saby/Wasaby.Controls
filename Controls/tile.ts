/**
 * tile library
 * @library Controls/tile
 * @includes View Controls/_tile/Tile
 * @includes ItemTemplate wml!Controls/_tile/TreeTileView/DefaultItemTpl
 * @public
 * @author Kraynov D.
 */

import View = require('Controls/_tile/Tile');
import ItemTemplate = require('wml!Controls/_tile/TreeTileView/DefaultItemTpl');

import TreeViewModel = require('Controls/_tile/TreeTileView/TreeTileViewModel');
import TreeView = require('Controls/_tile/TreeTileView/TreeTileView');

export {
   View,
   ItemTemplate,

   TreeViewModel,
   TreeView
}
