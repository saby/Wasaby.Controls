import Control = require('Core/Control');
import template = require('wml!Controls-demo/Async/AsyncTabsDemo/AsyncTabsDemo');

export default class extends Control {
    protected _template: Function = template;
    static _styles: string[] = ['Controls-demo/Async/AsyncTabsDemo/AsyncTabsDemo'];
}
