import ItemsRender = require("/resources/ItemsRender");
import VirtualScroll = require("/resources/VirtualScroll");
import ICollection = require("../interfaces/ICollection");
import ISource = require("../interfaces/ISource");
import IItemTemplate = require("../interfaces/IItemTemplate")
import IItemAction = require("../interfaces/IItemTemplate");
import IEventEmitter = require("../interfaces/IEvent")
import IItem = require("../interfaces/IItem");
import IListViewOptions = require("/Options")




class ListView {
    //где должен быть selectedKey?
    //проблема в том, что изменение данных
    //есть только в listcontrol
    //т.е. при изменение списка (например удаление)
    //происходит здесь
    //но порядковый номер есть только в listview
    //потому что только проекция знает правильный порядок
    //элементов, например в дереве.
    //при выходе из папки - опять же только TreeControl
    //управляет перезагрузкой данных
    //но отображаемый порядок записей будет только
    //в TreeView
    //
    private _enableVirtualScroll: boolean;
    private _selectedKey: number;
    private _selectedItem: IItem;
    protected _options;
    public onChangeSelection: IEventEmitter<number>;
    public onItemClick: IEventEmitter<any>;

    constructor(options : IListViewOptions){
        this._options = options;
        this._selectedKey = options.selectedKey;
        this._enableVirtualScroll = options.enableVirtualScroll || false;

        if (this._enableVirtualScroll) {
            // Init virtual scroll
        }

        //нужно найти item, в зависимости от selectedKey
        this._selectedItem = this._options.items.find(this._selectedKey);

        let listView = new ItemsRender({
            items: options.items,
            itemTemplate: options.itemTemplate,
            idProperty: options.idProperty,
            selectedItem: this._selectedItem,
            editingTemplate: options.editingTemplate
        });

        listView.onChangeSelection.subscribe((item)=>{
           this._selectedItem = item;
        });

        listView.onItemClick.subscribe((item) => {
            this.onItemClick.notify(item);
        });
    }
}

export = ListView;