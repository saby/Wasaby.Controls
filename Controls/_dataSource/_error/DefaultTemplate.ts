/// <amd-module name="Controls/_dataSource/_error/DefaultTemplate" />
// @ts-ignore
import * as Control from 'Core/Control';
// @ts-ignore
import * as template from 'wml!Controls/_dataSource/_error/DefaultTemplate';

/**
 * Шаблон отображения ошибки в виде диалогового окна с текстом из ошибки,
 * отображаемый "по умолчанию", если для полученной ошибки не было найдено соответствующего "парковочного шаблона"
 * @class Controls/_dataSource/_error/DefaultTemplate
 * @extends Core/Control
 * @control
 * @private
 */
export default class DefaultTemplate extends Control {
    _template = template;
    _closeHandler() {}
}
