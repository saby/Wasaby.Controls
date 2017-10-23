import IItemsViewOptions = require("../../ItemsView/resources/ItemsRenderOptions");
interface IGroupedItemsViewOptions {
    itemsGroup?: {
        method: () => void,
        field: string,
        template: () => void
    }
}
export = IGroupedItemsViewOptions;