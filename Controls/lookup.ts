/**
 * Lookup library
 * @library Controls/lookup
 * @includes Selector Controls/_lookup/Button
 * @includes Input Controls/_lookup/Lookup
 * @includes Collection Controls/_lookup/SelectedCollection
 * @includes _CollectionController Controls/_lookup/SelectedCollection/Controller
 * @includes ItemTemplate wml!Controls/_lookup/Lookup/itemTemplate
 * @includes Opener Controls/_lookup/Opener
 * @public
 * @author Kraynov D.
 */

import Selector = require("Controls/_lookup/Button");
import Input = require("Controls/_lookup/Lookup");
import Collection = require("Controls/_lookup/SelectedCollection");
import _CollectionController = require("Controls/_lookup/SelectedCollection/Controller");
import ItemTemplate = require("wml!Controls/_lookup/SelectedCollection/ItemTemplate");
import Opener = require("Controls/_lookup/Opener");

export {
   Selector,
   Input,
   Collection,
   _CollectionController,
   ItemTemplate,
   Opener
}
