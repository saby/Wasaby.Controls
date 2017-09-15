import ListView = require("ListView");
import ICollection = require("interfaces/ICollection");
import ISource = require("interfaces/ISource");
import IItemTemplate = require("interfaces/IItemTemplate")
import IItemAction = require("interfaces/IItemTemplate");
import IEventEmitter = require("interfaces/IEvent")


interface IListControlOptions {
    items?: ICollection | Array<any>,
    itemTemplate?: IItemTemplate,
    itemsActions?: Array<IItemAction>,
    idProperty?: string,
    //selection: IMultiSelection,//это непонятно. но про множественное выделение
    editingTemplate?: IItemTemplate,
    dataSource?: ISource,
    selectedKey?: number
}


class ListControl {
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
    private _selectedKey: number;
    public onChangeSelection: IEventEmitter<number>;
    public onItemClick: IEventEmitter<any>;

    constructor(options : IListControlOptions){
        this._selectedKey = options.selectedKey;

        let listView = new ListView({
            items: options.items,
            itemTemplate: options.itemTemplate,
            idProperty: options.idProperty,
            selectedKey: options.selectedKey,
            editingTemplate: options.editingTemplate
        });
        listView.onItemClick.subscribe((item) => {
            this.onItemClick.notify(item);
        });
        listView.onChangeHoveredItem.subscribe((item) => {

        });
        listView.onChangeSelection.subscribe((key) =>{
            this._selectedKey = key;
            this.onChangeSelection.notify(key);
        })
    }
}