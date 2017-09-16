import IListViewOptions = require("ListView/resources/ViewOptions");
import IHierarchicalViewOptions = require("../../interfaces/options/IHierarchicalViewOptions");

interface ITreeViewOptions
    extends IListViewOptions,
            IHierarchicalViewOptions {
}

export = ITreeViewOptions;