import IItemsOptions = require("./common/IItemsOptions");
import IGroupedItemsViewOptions = require("./common/IGroupedViewOptions");
import IHierarchicalViewOptions = require("./common/IHierarchicalViewOptions");
import ISourceOptions = require("./common/ISourceOptions");
import ISelectableOptions = require("./common/ISelecteableOptions");

interface IMenuOptions
    extends IItemsOptions,
            IGroupedItemsViewOptions,
            IHierarchicalViewOptions,
            ISourceOptions,
            ISelectableOptions{

}

export = IMenuOptions;