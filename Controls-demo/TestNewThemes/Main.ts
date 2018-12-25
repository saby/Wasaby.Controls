/// <amd-module name="Controls-demo/TestNewThemes/Main"/>
import * as BaseControl from 'Core/Control';
import template = require('wml!Controls-demo/TestNewThemes/Main');

class Main extends BaseControl {
    private _template: Function = template;
}

export = Main;