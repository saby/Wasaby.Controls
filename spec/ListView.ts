import ItemsView = require("ItemsView");
import IListViewOptions = require("options/IListViewOptions");
import IEventEmitter = require("interfaces/IEvent");
import IItem = require("./interfaces/IItem");

class ListViewDOM{
    onKeyDown: IEventEmitter<IItem>;
    onItemClick: IEventEmitter<IItem>;
}

/**
 * Контрол, отвечающий за аспект отображения списка
 * не содержит работу с источником данных
 * не занимается загрузкой по скроллу
 * не поддерживает виртуальный скролл.
 * Поддерживает отображение курсора, флажков выделения записи
 * Отображение редактирования по месту, операций над записью
 */

class ListView extends ItemsView{
    protected _options: IListViewOptions;
    public onChangeSelection: IEventEmitter<number>;
    private _selectedIndex: number;
    private _selectedItem: IItem;
    constructor(options : IListViewOptions){
        super(options);

        if(!this._options.selectedItem){//сюда попадем, если изначально не был установлен элемент, либо он был удален
            if(!this._selectedIndex) {
                this._selectedIndex = 0;//переводим на первый элемент
            }
            else{
                this._selectedIndex++;//условно ищем ближайший элемент, рядом с удаленным
            }
            this._selectedItem = this._display.at(this._selectedIndex);

        }

        let domObject = new ListViewDOM();
        domObject.onKeyDown.subscribe((item, index)=> {
            //обрабатываем нажатие на стрелку вверх и стрелку вниз
            //находим соседние элементы
            this._changeSelectedItem(item, index);
        });
        domObject.onItemClick.subscribe((item, index)=> {
            //кликаем по строке и переключаем выделенный элемент
            this._changeSelectedItem(item, index);
        })
    }

    private _changeSelectedItem(item, index){
        this.onChangeSelection.notify(item);
        this._selectedItem = item;
        this._selectedIndex = index;
    }

    render() {
        this._display.forEach((displayItem) => {
            //рассчитываем значение для модификатора выделенной строки
            let isSelectedModifier = this._selectedItem === displayItem;
            return '';
        });

    }
}


export = ListView;