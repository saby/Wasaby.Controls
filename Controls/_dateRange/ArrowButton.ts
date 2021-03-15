import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import * as template from 'wml!Controls/_dateRange/ArrowButton/ArrowButton';
import DateRangeContext from 'Controls/_dateRange/DateRangeContext';
import {IArrowButtonOptions} from 'Controls/buttons';

interface IDateRangeArrowButton extends IArrowButtonOptions {
    shiftPeriod: Function;
    dateRangeContext: DateRangeContext;
}

export default class ButtonsController extends Control<IDateRangeArrowButton> {
    protected _template: TemplateFunction = template;

    protected _clickHandler(): void {
        const delta = this._options.direction === 'left' ? -1 : 1;
        this._options.dateRangeContext.shiftPeriod(delta);
    }
}
