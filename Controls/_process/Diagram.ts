import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls/_process/Diagram');
import {calculateViewData} from './DiagramUtils';

export interface IDiagramCategory {
    name: string;
    value: number;
}

export interface IDiagramOptions extends IControlOptions {
    data: IDiagramCategory[];
}

class Diagram extends Control<IDiagramOptions> {
    protected _viewData: number[];
    protected _template: TemplateFunction = controlTemplate;

    protected _beforeMount(options?: IDiagramOptions): void {
        this._viewData = calculateViewData(options.data);
    }

    protected _beforeUpdate(options?: IDiagramOptions): void {
        if (options.data !== this._options.data) {
            this._viewData = calculateViewData(options.data);
        }
    }

    static _theme: string[] = ['Controls/process'];
}
export default Diagram;
