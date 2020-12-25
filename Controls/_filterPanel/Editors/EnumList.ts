import {Control} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Model} from 'Types/entity';
import ListEditorBase from 'Controls/_filterPanel/Editors/ListBase';

/**
 * Контрол используют в качестве редактора для выбора единичного значения из списка на {@link Controls/filterPanel:View панели фильтров}.
 * @class Controls/_filterPanel/Editors/EnumList
 * @extends Core/Control
 * @mixes Controls/_grid/interface/IGridControl
 * @mixes Controls/_interface/INavigation
 * @author Мельникова Е.А.
 * @public
 */

/**
 * @name Controls/_filterPanel/Editors/EnumList#showSelectorCaption
 * @cfg {String} Заголовок для кнопки в подвале списка, которая открывает окно выбора из справочника.
 * @demo Controls-demo/filterPanel/EnumListEditor/ShowSelectorCaption/Index
 * @default Другие
 */

/**
 * @name Controls/_filterPanel/Editors/EnumList#additionalTextProperty
 * @cfg {String} Имя свойства, содержащего информацию об идентификаторе дополнительного столбца в списке.
 * @demo Controls-demo/filterPanel/EnumListEditor/AdditionalTextProperty/Index
 */

/**
 * @name Controls/_filterPanel/Editors/EnumList#circleStyle
 * @cfg {String} Стиль отображения маркера в списке.
 * @variant default
 * @variant master
 * @default default
 */

class ListEditor extends ListEditorBase {
    protected _columns: object[] = null;

    protected _handleSelectedKeysChanged(event: SyntheticEvent, value: string[]|number[]): void {
        this._notifyPropertyValueChanged(value, true);
    }

    protected _handleSelectorResult(result: Model[]): void {
        const item = result.at(0);
        this._notifyPropertyValueChanged([item.get(this._options.keyProperty)], true);
    }
}
export default ListEditor;
