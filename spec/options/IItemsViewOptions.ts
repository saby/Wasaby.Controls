import ICollection = require("interfaces/ICollection");
import IItemTemplate = require("interfaces/IItemTemplate");

interface IItemsViewOptions{
    items: ICollection | Array<any>,
    itemTemplate?: IItemTemplate,
    displayProperty?: string,

    //вот это не понятно зачем
    // это приводит к появлению методов типа getLastItemByProjection
    //itemsSortMethod?: () => void,
    //вот это не понятно зачем
    //itemsFilterMethod?: () => void,

}

export = IItemsViewOptions;