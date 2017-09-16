import IItemsOptions = require("../../interfaces/options/IItemsOptions");
import IGroupedItemsViewOptions = require("../../interfaces/options/IGroupedViewOptions");

interface IMenuViewOptions
    extends IItemsOptions,
            IGroupedItemsViewOptions {

}

export = IMenuViewOptions;
