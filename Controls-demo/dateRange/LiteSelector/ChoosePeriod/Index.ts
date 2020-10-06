import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require("wml!Controls-demo/dateRange/LiteSelector/ChoosePeriod/Template");

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    targets: string = '';

    protected _afterMount(options?: IControlOptions, contexts?: any): void {
        document.addEventListener('touchstart', (e) => {
            this.targets += e.target.classList[0] + ' ';
        });
    }

    static _styles: string[] = ['Controls-demo/Controls-demo', 'Controls-demo/dateRange/LiteSelector/ChoosePeriod/Style'];
}

export default DemoControl;
