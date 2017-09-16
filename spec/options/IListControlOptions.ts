import ICollection = require("../interfaces/ICollection");
import IItemTemplate = require("../interfaces/IItemTemplate");
import IItemAction = require("../interfaces/IItemAction");
import ISource = require("../interfaces/ISource");
import IListViewOptions = require("./view/IListViewOptions");
import ISelectableOptions = require("./common/ISelecteableOptions");
import ISourceOptions = require("./common/ISourceOptions");
import IItemsOptions = require("./common/IItemsOptions");

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