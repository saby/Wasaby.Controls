import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import ButtonsTemplate = require('wml!Controls/_editableArea/Templates/Buttons');
import {tmplNotify} from 'Controls/eventUtils';

/**
 * Кнопки для сохранения и отмены редактирования.
 * @class Controls/_editableArea/Templates/Buttons
 * @extends UI/Base:Control
 * @public
 * @author Колесова П.С.
 * @demo Controls-demo/EditableArea/Buttons/Index
 */

/**
 * @event Controls/_editableArea/Templates/Buttons#applyButtonClick Происходит при клике на кнопку сохранения редактирования
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 */

/**
 * @event Controls/_editableArea/Templates/Buttons#closeButtonClick Происходит при клике на кнопку отмены редактирования
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 */

class Buttons extends Control<IControlOptions> {
    protected _template: TemplateFunction = ButtonsTemplate;
    protected _tmplNotify: Function = tmplNotify;
    static _theme: string[] = ['Controls/editableArea'];
}

export default Buttons;
