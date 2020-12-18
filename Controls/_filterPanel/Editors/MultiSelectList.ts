import {Control} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Model} from 'Types/entity';
import ListEditorBase from 'Controls/_filterPanel/Editors/ListBase';
import {IListEditorOptions} from 'Controls/_filterPanel/Editors/ListBase';
import {List} from 'Types/collection';
import {factory} from 'Types/chain';
import {ISelectorTemplate} from 'Controls/interface';

/**
 * Контрол используют в качестве редактора для выбора множества значений из списка на {@link Controls/filterPanel:View панели фильтров}.
 * @class Controls/_filterPanel/Editors/MultiSelectList
 * @extends Core/Control
 * @mixes Controls/_grid/interface/IGridControl
 * @mixes Controls/_interface/INavigation
 * @author Мельникова Е.А.
 * @public
 */

/**
 * @name Controls/_filterPanel/Editors/MultiSelectList#showSelectorCaption
 * @cfg {String} Заголовок для кнопки в подвале списка, которая открывает окно выбора из справочника.
 * @demo Controls-demo/filterPanel/EnumListEditor/ShowSelectorCaption/Index
 * @default Другие
 */

/**
 * @name Controls/_filterPanel/Editors/MultiSelectList#additionalTextProperty
 * @cfg {String} Имя свойства, содержащего информацию об идентификаторе дополнительного столбца в списке.
 * @demo Controls-demo/filterPanel/EnumListEditor/AdditionalTextProperty/Index
 */

export default class MultiSelectList extends ListEditorBase {
    protected _columns: object[] = null;

    protected _beforeUpdate(newOptions: IListEditorOptions): void {
        super._beforeUpdate(newOptions);
    }

    protected _handleSelectedKeysChanged(event: SyntheticEvent, keys: string[]|number[]): void {
        this._selectedKeys = keys;
        this._notifyPropertyValueChanged(this._getTextValue());
    }

    protected _handleItemClick(event: SyntheticEvent, item: Model, nativeEvent: SyntheticEvent): void {
        const contentClick = nativeEvent.target.closest('.controls-EditorList__columns');
        if (contentClick) {
            this._selectedKeys = [item.get(this._options.keyProperty)];
            this._notifyPropertyValueChanged(this._getTextValue(), true);
        }
    }

    protected _handleSelectorResult(result: Model[]): void {
        this._selectedKeys = [];
        result.forEach((item) => {
            this._selectedKeys.push(item.get(this._options.keyProperty));
        });
        this._notifyPropertyValueChanged(this._getTextValue());
    }

    protected _getTemplateOptions(selectorOptions: ISelectorTemplate): object {
        return {
            ...selectorOptions.templateOptions,
            ...{
                selectedKeys: this._selectedKeys,
                selectedItems: this._getSelectedItems(),
                multiSelect: true
            }
        };
    }

    protected _notifyPropertyValueChanged(textValue: string, needColapse?: boolean): void {
        const extendedValue = {
            value: this._selectedKeys,
            textValue,
            needColapse
        };
        this._setColumns(this._options.displayProperty, this._selectedKeys, this._options.additionalTextProperty);
        this._notify('propertyValueChanged', [extendedValue], {bubbling: true});
    }

    private _getSelectedItems(): List<Model> {
        const selectedItems = [];
        factory(this._selectedKeys).each((key) => {
            const record = this._items.getRecordById(key);
            if (key !== undefined && key !== null && record) {
                selectedItems.push(record);
            }
        });
        return new List({
            items: selectedItems
        });
    }

    private _getTextValue(): string {
        let text = '';
        this._selectedKeys.forEach((item, index) => {
            const record = this._items.getRecordById(item);
            text = text + record.get(this._options.displayProperty) + (index === this._selectedKeys.length - 1 ? '' : ', ');
        });
        return text;
    }

    static getDefaultOptions(): object {
        return {
            ...ListEditorBase.getDefaultOptions(),
            ...{
                multiSelectVisibility: 'onhover'
            }
        };
    }
}
