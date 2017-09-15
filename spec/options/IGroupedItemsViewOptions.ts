import IItemsViewOptions = require("./IItemsViewOptions");
interface IGroupedItemsViewOptions extends IItemsViewOptions {
    itemsGroup?: {
        method: () => void,
        field: string,
        template: () => void
    }
}
export = IGroupedItemsViewOptions;