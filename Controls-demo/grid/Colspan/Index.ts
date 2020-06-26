import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as Template from 'wml!Controls-demo/grid/Colspan/Colspan';
import {Memory} from 'Types/source';

// TODO
const columns = [

]

/**
 * Демка для случая по ошибке https://online.sbis.ru/opendoc.html?guid=0bc9f06e-035e-48d6-bac6-873ed5a7a04e
 * ФР: Нарушено выравнивание по вертикальной линии. Поле с подразделением и с начислениями отображаются без отступа  (скрин 1, 2)
 * ОР: Есть отступ, отображение данных в блоке соответствуют макету:
 * http://axure.tensor.ru/sotrudniki_zarplata/%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B0_%D0%B4%D0%BE%D0%BB%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8__new_23_07_19.html#OnLoadVariable=1&NewVariable=768&CSUM=1
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _keyProperty: string = 'id'
    protected _source: Memory;
    protected _columns: any[];

    // TODO
    protected _itemTemplate: TemplateFunction;
    protected _emptyTemplate: TemplateFunction;
    protected _groupTemplate: TemplateFunction;
    protected _itemPadding: any;
    protected _collapsedGroups: any[];
    protected _editingConfig: any;
    protected _itemActions: any[];
    protected _showEditArrow: boolean;
    protected _headerRow: any;
    protected _isEditing: boolean;

    protected _beforeMount(options?: IControlOptions, contexts?: object, receivedState?: void): Promise<void> | void {
        this._columns = columns;
        // TODO
        this._source = new Memory({});
    }

    // TODO
    protected _groupingKeyCallback(a, b) {

    }

    // TODO
    protected _itemsLoadHandler(a, b) {

    }

    // todo
    protected _itemActionVisibilityCallback(a, b) {

    }

    // TODO
    _notifyHandler(a) {

    }

    // TODO
    _editHandler(a) {

    }

    // TODO
    _addItem() {

    }

    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
