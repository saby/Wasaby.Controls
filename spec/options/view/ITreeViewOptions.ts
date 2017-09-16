import IListViewOptions = require("options/view/IListViewOptions");

interface ITreeViewOptions extends IListViewOptions{
    parentProperty: string,
    hasChildrenProperty?: string
}

export = ITreeViewOptions;