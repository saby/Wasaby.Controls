import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {IDiagramCategory} from 'Controls/process';
import controlTemplate = require('wml!Controls-demo/process/Diagram/Base/Template');

class Diagram extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _data2: IDiagramCategory[] = [];
    protected _data3: IDiagramCategory[] = [];

    protected _beforeMount(): void {
        this._data2 = [
            {
                name : 'done',
                value: 30
            },
            {
                name: 'inprocess',
                value: 60
            }
        ];
        this._data3 = [
            {
                name : 'done',
                value: 30
            },
            {
                name: 'inprocess',
                value: 60
            },
            {
                name: 'error',
                value: 10
            }
        ];
    }

    static _theme: string[] = ['Controls/Classes'];
    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
export default Diagram;
