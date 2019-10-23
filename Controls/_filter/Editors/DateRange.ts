import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {Utils} from 'Controls/dateRange';
import {SyntheticEvent} from 'Vdom/Vdom';
import DateRangeTemplate = require('wml!Controls/_filter/Editors/DateRange');
import tmplNotify = require('Controls/Utils/tmplNotify');

class DateRangeEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = DateRangeTemplate;
    protected _tmplNotify: Function = tmplNotify;

    private _rangeChanged(event: SyntheticEvent<'rangeChanged'>, startValue: Date, endValue: Date): void {
        const caption = Utils.formatDateRangeCaption.call(null, startValue, endValue, this._options.emptyCaption);

        this._notify('rangeChanged', [startValue, endValue]);
        this._notify('textValueChanged', [caption]);
    }
}
export default DateRangeEditor;
