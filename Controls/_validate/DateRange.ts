import Controller = require('Controls/_validate/Controller');
import template = require('wml!Controls/_validate/DateRange');

const DateRange = Controller.extend({
    _template: template,
    _deactivatedHandler: function() {
        if (!this._options.readOnly) {
            this._shouldValidate = true;
            this._forceUpdate();
        }
    },
    _inputCompletedHandler: function(event, ...rest) {
        this._notify('inputCompleted', rest);
        // Because of this error:
        // https://online.sbis.ru/opendoc.html?guid=ef52bfb5-56ea-4397-a77f-89e5c3413ed9
        // we need to stop event propagation, otherwise all subscribtions to inputComplete-event of
        // this control will be called twice
        event.stopPropagation();
    },
    _afterUpdate: function(oldOptions) {
        if (this._shouldValidate || this._options.value !== oldOptions.value) {
            this._shouldValidate = false;
            this.validate();
        }
    }
});
export = DateRange;
