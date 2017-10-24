import ICollection = require("../interfaces/ICollection");
import IItemTemplate = require("../interfaces/IItemTemplate");
import IItemAction = require("../interfaces/IItemAction");
import ISource = require("../interfaces/ISource");
import IListViewOptions = require("./resources/ItemsRenderOptions");
import ISelectableOptions = require("../interfaces/options/ISelecteableOptions");
import ISourceOptions = require("../interfaces/options/ISourceOptions");
import IItemsOptions = require("../interfaces/options/IItemsOptions");

interface Options
    extends IItemsOptions,
            ISelectableOptions,
            ISourceOptions {
    itemsActions?: Array<IItemAction>,
    idProperty?: string,
    //selection: IMultiSelection,//это непонятно. но про множественное выделение
    editingTemplate?: IItemTemplate,
    enableVirtualScroll?: boolean
}

export = Options;