import ItemsView = require("ItemsView");
import ICollection = require("interfaces/ICollection");
import ISource = require("interfaces/ISource");
import IItemTemplate = require("interfaces/IItemTemplate")

class ItemsControl {
    constructor(options: {
        items: ICollection | Array<any>,
        itemTemplate: IItemTemplate,
        dataSource: ISource,
        navigation: {
            type: string,
            config: {
                pageSize?: number
            }
        },
        emptyHTML?: string,
        filter? : {},
        sorting?: Array<any>,
        /**
         * @cfg {String} Устанавливает стратегию действий с подгружаемыми в список записями
         * @variant merge - мержить, при этом записи с одинаковыми id схлопнутся в одну
         * @variant append - добавлять, при этом записи с одинаковыми id будут выводиться в списке
         *
         */
        loadItemsStrategy?: string,//непонятная штука
        footerTemplate?: () => void //непонятно, почему нет headertemplate
    }){
        let listView = new ItemsView({
            items: options.items,
            itemTemplate: options.itemTemplate
        })
    }
    onItemClick(){}
    reload(){}
    //вот тут надо подумать. возможно нужен
    //метод sync с более богатым интерфейсом
    reloadItem(id:string){}
}