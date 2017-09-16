import IItemsViewOptions = require("../view/IItemsViewOptions");
interface IGroupedItemsViewOptions {
    itemsGroup?: {
        method: () => void,
        field: string,
        template: () => void
    }
}
export = IGroupedItemsViewOptions;