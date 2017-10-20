import ICollection = require("..//ICollection");
import IItemTemplate = require("..//IItemTemplate");

interface IItemsOptions{
    items: ICollection | Array<any>,
    itemTemplate?: IItemTemplate,
    displayProperty?: string,

    //вот это не понятно зачем
    // это приводит к появлению методов типа getLastItemByProjection
    //itemsSortMethod?: () => void,
    //вот это не понятно зачем
    //itemsFilterMethod?: () => void,

}

export = IItemsOptions;