import {Control} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import {factory} from 'Types/chain';
import {Model} from 'Types/entity';
import {object} from 'Types/util';
import ListEditorBase from 'Controls/_filterPanel/Editors/ListBase';

/**
 * Контрол используют в качестве редактора для выбора единичного значения из списка на {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/filter-view/base-settings/#step-3 панели фильтров}.
 * @class Controls/_filterPanel/Editors/EnumList
 * @extends Core/Control
 * @author Мельникова Е.А.
 * @public
 */
class ListEditor extends ListEditorBase {
    protected _columns: object[] = null;

    protected async _handleMarkedKeyChanged(event: SyntheticEvent, value: string|number): void {
        const extendedValue = {
            value,
            textValue: await this._getTextValue(value),
            needColapse: true
        };
        this._notify('propertyValueChanged', [extendedValue], {bubbling: true});
    }

    protected _handleSelectorResult(result: Model[]): void {
        this._handleMarkedKeyChanged(null, this._getSelectedKey(result, this._options.keyProperty));
    }

    private _getSelectedKey(items: Model[], keyProperty: string): string|number {
        let key;
        factory(items).each((item) => {
            key = object.getPropertyValue(item, keyProperty);
        });
        return key;
    }

    protected _getTextValue(value: string|number): Promise<string> {
        let textValue = '';
        return this._options.source.read(value).then((item) => {
            textValue = item.get(this._options.displayProperty);
            return textValue;
        });
    }

    static getDefaultOptions(): object {
        return {
            ...ListEditorBase.getDefaultOptions(),
            ...{
                markerVisibility: false
            }
        };
    }
}
export default ListEditor;
