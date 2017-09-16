import ListView = require("ListView/resources/View")
import ITreeViewOptions = require("TreeView/resources/ViewOptions");

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
