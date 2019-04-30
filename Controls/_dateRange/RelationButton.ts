import Control = require('Core/Control');
import {descriptor} from 'Types/entity';
import template = require('wml!Controls/_dateRange/RelationButton/RelationButton');

/**
 * Button for linking periods. The control that can be used with {@link Controls/_dateRange/RelationController RelationController}.
 *
 * @class Controls/_dateRange/RelationButton
 * @extends Core/Control
 *
 * @css @color_DateRangeRelationButton-normal_hovered Color of the button in normal hovered state.
 * @css @color_DateRangeRelationButton-byCapacity_hovered Color of the button in by capacity hovered state.
 *
 * @control
 * @public
 * @category Input
 * @author Mironov A.U.
 * @demo Controls-demo/dateRange/RelationController
 *
 */

const
    valueMap = {
        normal: true,
        byCapacity: false
    },
    _private = {
        update: function(self, options) {
            self._value = valueMap[options.value];
        }
    }

const Component = Control.extend({
    _template: template,
    _value: true,

    _beforeMount: function (options) {
        _private.update(this, options);
    },

    _beforeUpdate: function (options) {
        _private.update(this, options);
    },

    _onValueChanged: function (event, value) {
        let bindType = value ? 'normal' : 'byCapacity';
        event.stopImmediatePropagation();
        this._notify('valueChanged', [bindType]);
        this._notify('relationButtonBindTypeChanged', [bindType], { bubbling: true });
    }
});

Component.getOptionTypes = function () {
    return {
        value: descriptor(String).oneOf([
            'normal',
            'byCapacity'
        ])
    };
};

Component.getDefaultOptions = function () {
    return {
        value: 'normal'
    };
};
Component._theme = ['Controls/dateRange'];
export default Component;
