/**
 * Библиотека контролов, которые реализуют иерархический список, отображающийся в виде плитки.
 * @library Controls/tile
 * @includes View Controls/_tile/View
 * @includes ItemTemplate wml!Controls/_tile/ItemTemplateChooser
 * @includes TileStyles Controls/_tile/Tile/Styles
 * @includes TreeTileViewStyles Controls/_tile/TreeTileView/Styles
 * @includes ITile Controls/_tile/interface/ITile
 * @includes IDraggable Controls/interface/IDraggable
 * @public
 * @author Крайнов Д.О.
 */

/*
 * tile library
 * @library Controls/tile
 * @includes View Controls/_tile/View
 * @includes ItemTemplate wml!Controls/_tile/ItemTemplateChooser
 * @includes TileStyles Controls/_tile/Tile/Styles
 * @includes TreeTileViewStyles Controls/_tile/TreeTileView/Styles
 * @includes ITile Controls/_tile/interface/ITile
 * @includes IDraggable Controls/interface/IDraggable
 * @public
 * @author Крайнов Д.О.
 */

import View = require('Controls/_tile/View');
import ItemTemplate = require('wml!Controls/_tile/ItemTemplateChooser');

import TreeViewModel = require('Controls/_tile/TreeTileView/TreeTileViewModel');
import TreeView = require('Controls/_tile/TreeTileView/TreeTileView');

// FIXME Remove this before merging, tile render should probably moved to the
// listRender library as well
import TileRender from 'Controls/_tile/TileRender';

export {
   View,
   ItemTemplate,

   TreeViewModel,
   TreeView,

   TileRender
};
