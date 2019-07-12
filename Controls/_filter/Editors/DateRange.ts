import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import DateRangeTemplate = require('wml!Controls/_filter/Editors/DateRange');
import tmplNotify = require('Controls/Utils/tmplNotify');

class DateRangeEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = DateRangeTemplate;
    protected _tmplNotify = tmplNotify;
}
export default DateRangeEditor;
