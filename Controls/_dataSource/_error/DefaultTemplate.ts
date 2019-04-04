/// <amd-module name="Controls/_dataSource/_error/DefaultTemplate" />
// @ts-ignore
import * as Control from 'Core/Control';
// @ts-ignore
import * as template from 'wml!Controls/_dataSource/_error/DefaultTemplate';

export default class DefaultTemplate extends Control {
    _template = template;
    _closeHandler() {}
}
