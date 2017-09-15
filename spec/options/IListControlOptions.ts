import ICollection = require("../interfaces/ICollection");
import IItemTemplate = require("../interfaces/IItemTemplate");
import IItemAction = require("../interfaces/IItemAction");
import ISource = require("../interfaces/ISource");
import IListViewOptions = require("./IListViewOptions");
import ISelectableOptions = require("./ISelecteableOptions");
import ISourceOptions = require("./ISourceOptions");
import IItemsOptions = require("./IItemsOptions");

interface IListControlOptions
    extends IItemsOptions,
            ISelectableOptions,
            ISourceOptions {
    itemsActions?: Array<IItemAction>,
    idProperty?: string,
    //selection: IMultiSelection,//это непонятно. но про множественное выделение
    editingTemplate?: IItemTemplate,
    enableVirtualScroll?: boolean
}

export = IListControlOptions;