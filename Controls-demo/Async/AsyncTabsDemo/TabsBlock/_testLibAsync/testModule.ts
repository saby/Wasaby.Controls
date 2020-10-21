import Control = require('Core/Control');
import template = require('wml!Controls-demo/Async/AsyncTabsDemo/TabsBlock/_testLibAsync/testModule');

export default class TestModule extends Control {
    protected _template: Function = template;
}
