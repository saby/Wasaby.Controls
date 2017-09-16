import ItemsView = require("ItemsView/resources/View");
import ICollection = require("interfaces/ICollection");
import ISource = require("interfaces/ISource");
import IItemTemplate = require("interfaces/IItemTemplate")
import IItemsControlOptions = require("./Options");

class ItemsControl {
    constructor(options: IItemsControlOptions){
        let listView = new ItemsView({
            items: options.items,
            itemTemplate: options.itemTemplate
        })
    }
    onItemClick(){}
    reload(){

    }
    //вот тут надо подумать. возможно нужен
    //метод sync с более богатым интерфейсом
    reloadItem(id:string){}
}