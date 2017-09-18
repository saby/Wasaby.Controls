import IItemsOptions = require("../interfaces/options/IItemsOptions");
import IGroupedItemsViewOptions = require("../interfaces/options/IGroupedViewOptions");
import IHierarchicalViewOptions = require("../interfaces/options/IHierarchicalViewOptions");
import ISourceOptions = require("../interfaces/options/ISourceOptions");
import ISelectableOptions = require("../interfaces/options/ISelecteableOptions");

interface Options
    extends IItemsOptions,
            IGroupedItemsViewOptions,
            IHierarchicalViewOptions,
            ISourceOptions,
            ISelectableOptions{

}

export = Options;