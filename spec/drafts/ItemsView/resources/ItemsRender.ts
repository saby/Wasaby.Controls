import ItemsDisplay = require("../../interfaces/display/ItemsDisplay");
import IItemsRenderOptions = require("..//resources/ItemsRenderOptions");
import IEventEmitter = require("../../interfaces/IEvent")


class ItemsRender {
    protected _display : ItemsDisplay;
    protected _options : IItemsRenderOptions;
    public onItemClick: IEventEmitter<any>;
    ////это событие мне не понятно. возможно оно не нужно и мы все будем делдать на CSS
    //для этого необходимо будет упросить требования к макетам
    public onChangeHoveredItem: IEventEmitter<any>;

    constructor(options: IItemsRenderOptions){
        this._display = new ItemsDisplay(options.items);
        this._options = options;
    }

    render(){
        this._display.forEach((displayItem) => {
            return '';
        });
    }

}

export = ItemsRender;