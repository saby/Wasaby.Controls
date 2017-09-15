import ListView = require("ListView")
import ITreeViewOptions = require("options/ITreeViewOptions");

class TreeView extends ListView {
    constructor(options: ITreeViewOptions) {
        super({
            items: options.items,
            itemTemplate: options.itemTemplate,
            itemsActions: options.itemsActions,
            idProperty: options.idProperty,
            //selection: options.selection,
            editingTemplate: options.editingTemplate
        });
    }
}

export = TreeView;
