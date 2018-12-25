/// <amd-module name="Controls-demo/TestNewThemes/TestControl"/>
import * as BaseControl from 'Core/Control';
import template = require('wml!Controls-demo/TestNewThemes/TestControl');
import 'css!theme?Controls-demo/TestNewThemes/TestControlThemed'

class TestControl extends BaseControl {
    private _template: Function = template;
    public _theme: Array<string> = ['Controls-demo/TestNewThemes/TestControlThemed'];
    public _styles: Array<string> = ['Controls-demo/TestNewThemes/TestControl'];
    protected _beforeMount(): void {
    }
}

export = TestControl;
