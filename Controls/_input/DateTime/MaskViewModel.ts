import StringValueConverter = require('Controls/_input/DateTime/StringValueConverter');
import dateUtils = require('Controls/Utils/Date');
import ViewModel = require('Controls/_input/Mask/ViewModel');

class ModuleClass extends ViewModel {
    private handleInput(splitValue, inputType) {
        let _stringValueConverter = new StringValueConverter({replacer: this._replacer}), date;
        if (splitValue.insert.length > 1) {
            date = _stringValueConverter.getValueByString(splitValue.insert);
        }
        if (dateUtils.isValidDate(date)) {
            const dateValue = _stringValueConverter.getStringByValue(date, this.options.mask);
            const displayValue = dateValue;
            const hasChangedDisplayValue = this._displayValue !== displayValue;

            this._displayValue = displayValue;
            this._value = this._convertToValue(displayValue);
            this._selection.start = 0;
            this._selection.end = 0;

            this._shouldBeChanged = true;

            return hasChangedDisplayValue;
        } else {
            return super.handleInput.apply(this, arguments);
        }
    }
}

export default ModuleClass;
