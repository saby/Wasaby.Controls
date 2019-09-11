import Controller = require('Controls/_validate/Controller');
import template = require('wml!Controls/_validate/DateRange');

const DateRange = Controller.extend({
    _template: template,
    _rangeChangedHandler: function(){
        if (!this._options.readOnly) {
            this._shouldValidate = true;
            this._forceUpdate();
        }
    },
    _afterUpdate: function(oldOptions) {
        if (this._shouldValidate || this._options.value !== oldOptions.value) {
            this._shouldValidate = false;
            this.validate();
        }
    }
});
export = DateRange;
