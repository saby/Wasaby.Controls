import IItemsOptions = require("../../interfaces/options/IItemsOptions");
import IGroupedItemsViewOptions = require("../../interfaces/options/IGroupedViewOptions");

interface Options
    extends IItemsOptions,
            IGroupedItemsViewOptions {

}

export = Options;
