import Container from 'Controls/_validate/Container';
import {TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_validate/DateRange');

class DateRange extends Container {
    _template: TemplateFunction = template;
    _rangeChangedHandler(): void {
        if (!this._options.readOnly) {
            this._shouldValidate = true;
            this._forceUpdate();
        }
    }
    protected _afterUpdate(oldOptions): void {
        if (this._shouldValidate || this._options.value !== oldOptions.value) {
            this._shouldValidate = false;
            this.validate();
        }
    }
}
export default DateRange;
