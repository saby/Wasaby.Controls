import ICollection = require("../interfaces/ICollection");

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
}

export = ItemsDisplay;