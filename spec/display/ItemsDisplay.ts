import ICollection = require("../interfaces/ICollection");
import IItem = require("../interfaces/IItem");

/**
 * проекция
 */
class ItemsDisplay{
    private _items: ICollection;
    constructor(items: ICollection | Array<any>, sorting?, grouping?){
        this._items = items;
    }
    forEach(fn: (item) => {}){
        this._items.forEach(fn);
    }
    at(i:number):IItem{

    }
}

export = ItemsDisplay;