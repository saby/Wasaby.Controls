import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {IDiagramCategory} from 'Controls/process';
import controlTemplate = require('wml!Controls-demo/process/Diagram/BorderVisible/Template');

class Diagram extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _data: IDiagramCategory[] = [];

    protected _beforeMount(): void {
        this._data = [
            {
                name : 'done',
                value: 30
            },
            {
                name: 'error',
                value: 10
            },
            {
                name: 'inprocess',
                value: 60
            }
        ];
    }

    static _theme: string[] = ['Controls/Classes'];
    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
export default Diagram;
