import ItemsDisplay = require("display/ItemsDisplay");
import IItemsViewOptions = require("options/IItemsViewOptions");
import IEventEmitter = require("interfaces/IEvent")


class ItemsView {
    protected _display : ItemsDisplay;
    protected _options : IItemsViewOptions;
    public onItemClick: IEventEmitter<any>;
    ////это событие мне не понятно. возможно оно не нужно и мы все будем делдать на CSS
    //для этого необходимо будет упросить требования к макетам
    public onChangeHoveredItem: IEventEmitter<any>;

    constructor(options: IItemsViewOptions){
        this._display = new ItemsDisplay(options.items);
        this._options = options;
    }

    render(){
        this._display.forEach((displayItem) => {
            return '';
        });
    }

}

export = ItemsView;