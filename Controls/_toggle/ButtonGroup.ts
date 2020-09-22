import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
// @ts-ignore
import template = require('wml!Controls/_toggle/ButtonGroup/ButtonGroup');
import {Record, Model} from 'Types/entity';
import {ISingleSelectableOptions} from 'Controls/interface';
import {SyntheticEvent} from 'Vdom/Vdom';

export interface IButtonGroupOptions extends ISingleSelectableOptions, IControlOptions {
    items: Record[];
}
/**
 * Контрол представляет собой набор из нескольких взаимосвязанных между собой кнопок. Используется, когда необходимо выбрать один из нескольких параметров.
 * @class Controls/_toggle/ButtonGroup
 * @extends Core/Control
 * @mixes Controls/_interface/ISingleSelectable
 * @control
 * @public
 * @author Бондарь А.В.
 * @category Toggle
 * @demo Controls-demo/toggle/ButtonGroup/Index
 *
 * @name Controls/_toggle/ButtonGroup#items
 * @cfg {Array<Record>} Данные кнопок
 */

class ButtonGroup extends Control<IButtonGroupOptions> {
    protected _template: TemplateFunction = template;

    protected _onItemClick(event: SyntheticEvent<Event>, item: Model): void {
        this._notify('selectedKeyChanged', [item.get(this._options.keyProperty)]);
    }

    static _theme: string[] = ['Controls/buttons', 'Controls/toggle', 'Controls/Classes'];

    static getDefaultOptions(): object {
        return {
            keyProperty: 'id'
        };
    }
}

export default ButtonGroup;
