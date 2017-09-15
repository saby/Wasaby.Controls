import ItemsView = require("ItemsView");
import IListViewOptions = require("options/IListViewOptions");
import IEventEmitter = require("interfaces/IEvent")

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

    constructor(options : IListViewOptions){
        super(options);
    }

    render() {
        this._display.forEach((displayItem) => {
            //рассчитываем значение для модификатора выделенной строки
            let isSelectedModifier = displayItem.getKey() === this._options.selectedKey;
            return '';
        });

    }
}


export = ListView;