import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
// @ts-ignore
import template = require('wml!Controls/_toggle/RadioButtons/RadioButtons');
import {Record, Model} from 'Types/entity';
import {ISingleSelectableOptions} from 'Controls/interface';
import {SyntheticEvent} from 'Vdom/Vdom';

export interface IRadioButtonsOptions extends ISingleSelectableOptions, IControlOptions {
    items: Record[];
}
/**
 * Контрол представляет собой набор из нескольких взаимосвязанных между собой кнопок. Используется, когда необходимо выбрать один из нескольких параметров.
 * @class Controls/_toggle/RadioButtons
 * @extends Core/Control
 * @mixes Controls/_interface/ISingleSelectable
 * @control
 * @public
 * @author Бондарь А.В.
 * @category Toggle
 * @demo Controls-demo/toggle/RadioButtons/Index
 *
 * @name Controls/_toggle/RadioButtons#items
 * @cfg {Array<Record>} Данные кнопок
 */

class RadioButtons extends Control<IRadioButtonsOptions> {
    protected _template: TemplateFunction = template;
    protected _items: Record[];

    protected _beforeMount(options?: IRadioButtonsOptions,
                           contexts?: object, receivedState?: void): Promise<void> | void {
        this._items = options.items;
    }
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

export default RadioButtons;
