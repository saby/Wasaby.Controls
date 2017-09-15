import IItemsViewOptions = require("IItemsViewOptions");
import IItemTemplate = require("interfaces/IItemTemplate");
import IItemAction = require("interfaces/IItemAction");


interface IListViewOptions extends IItemsViewOptions{
    itemsActions?: Array<IItemAction>,
    idProperty?: string, //не понятно. хотелось бы без него
    //selection: IMultiSelection, //пока непонятно что это такое. нужна информация только для отображения.
    editingTemplate?: IItemTemplate,
    selectedKey?: number
}

export = IListViewOptions;