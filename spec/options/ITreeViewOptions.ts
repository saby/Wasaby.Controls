import IListViewOptions = require("IListViewOptions");

interface ITreeViewOptions extends IListViewOptions{
    parentProperty: string,
    hasChildrenProperty?: string
}

export = ITreeViewOptions;