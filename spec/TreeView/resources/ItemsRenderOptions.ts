import IListViewOptions = require("ListView/resources/ItemsRenderOptions");
import IHierarchicalViewOptions = require("../../interfaces/options/IHierarchicalViewOptions");

interface ITreeViewOptions
    extends IListViewOptions,
            IHierarchicalViewOptions {
}

export = ITreeViewOptions;