import ItemsRender = require("ItemsView/resources/ItemsRender");
import ICollection = require("interfaces/ICollection");
import ISource = require("interfaces/ISource");
import IItemTemplate = require("interfaces/IItemTemplate")
import Options = require("./Options");

class ItemsView {
    constructor(options: Options){
        let listView = new ItemsRender({
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