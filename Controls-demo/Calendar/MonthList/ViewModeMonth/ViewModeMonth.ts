import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {date as formatDate} from 'Types/formatter';
import template = require('wml!Controls-demo/Calendar/MonthList/ViewModeMonth/ViewModeMonth');
import 'css!Controls-demo/Controls-demo';

class DemoControl extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _position: Date = new Date(2020, 0, 1);

    protected _getHeader(date: Date): string {
        return date ? formatDate(date, formatDate.FULL_MONTH) : '';
    }

    static _theme: string[] = ['Controls/Classes'];
}
export default DemoControl;
