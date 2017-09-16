import IListViewOptions = require("options/view/IListViewOptions");
import IHierarchicalViewOptions = require("../common/IHierarchicalViewOptions");

interface ITreeViewOptions
    extends IListViewOptions,
            IHierarchicalViewOptions {
}

export = ITreeViewOptions;