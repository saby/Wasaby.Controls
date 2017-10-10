import ListViewRender = require("../../ListView/resources/ItemsRender")
import ITreeViewOptions = require("..//resources/ItemsRenderOptions");

class TreeItemsRender extends ListViewRender {
    constructor(options: ITreeViewOptions) {
        super({
            items: options.items,
            itemTemplate: options.itemTemplate,
            itemsActions: options.itemsActions,
            idProperty: options.idProperty,
            //selection: options.selection,
            editingTemplate: options.editingTemplate,
            selectedItem: options.selectedItem

        });
    }
}

export = TreeItemsRender;
