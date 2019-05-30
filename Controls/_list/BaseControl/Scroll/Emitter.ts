/**
 * Created by kraynovdo on 15.02.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_list/BaseControl/Scroll/Emitter/Emitter');

var ScrollEmitter = Control.extend({
    _template: template,


    // https://online.sbis.ru/opendoc.html?guid=b1bb565c-43de-4e8e-a6cc-19394fdd1eba
    startRegister: function (triggers, task1177135045) {
        this._notify('register', ['listScroll', this, this.handleScroll, triggers, task1177135045], {bubbling: true});
    },

    _beforeUnmount: function () {
        this._notify('unregister', ['listScroll', this], {bubbling: true});
    },
    handleScroll: function () {
        this._notify('emitListScroll', Array.prototype.slice.call(arguments));
    }
});

ScrollEmitter.getOptionTypes = function () {
    return {};
};

export = ScrollEmitter;
