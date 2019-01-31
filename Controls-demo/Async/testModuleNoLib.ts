import Control = require('Core/Control');
import template = require('wml!Controls-demo/Async/testModuleNoLib');

class testModule extends Control {
    private _template: Function = template;
}

export = testModule;
