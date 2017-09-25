import IMenuViewOptions = require("./ItemsRenderOptions");
import IEvent = require("../../interfaces/IEvent");
import IItem = require("../../interfaces/IItem");

class MenuViewDOM{
    onItemClick: IEvent<IItem>;
}

class ItemsRender {
    public onItemClick: IEvent<IItem>;
    public onNeedSubmenu: IEvent<any>;

    constructor(options: IMenuViewOptions){

        let domObject = new MenuViewDOM();
        domObject.onItemClick.subscribe((item)=>{
            let is_leaf;//определяем узел или лист
            if(is_leaf) {
                this.onItemClick.notify(item);
            } else {
                //нужно передать привязку к dom-элементу
                this.onNeedSubmenu.notify(item);
            }
        })
    }
}

export = ItemsRender;
