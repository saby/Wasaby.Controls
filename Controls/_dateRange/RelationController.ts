import Control = require('Core/Control');
import Model from './RelationController/Model';
import template = require('wml!Controls/_dateRange/RelationController/RelationController');

/**
 * Controller allows you to link several components for entering periods.
 *
 * @class Controls/_dateRange/RelationController
 * @extends Core/Control
 *
 * @control
 * @public
 * @demo Controls-demo/Input/Date/PickerPG
 * @author Миронов А.Ю.
 */

/**
 * @name Controls/_dateRange/RelationController#startValue0
 * @cfg {Date} Start value of the first period.
 * @remark
 * You can bind the options startValue0, startValue1, startValue2 in an amount equal to the number of controls you need to associate.
 * @example
 * This example shows how to bind 2 range input controls.
 * <pre>
 *    <Controls.dateRange.RelationController
 *          bind:startValue0="_startValue0"
 *          bind:endValue0="_endValue0"
 *          bind:startValue1="_startValue1"
 *          bind:endValue1="_endValue1"/>
 *    <Controls.dateRange.LiteSelector bind:startValue="_startValue0" bind:endValue="_endValue0" />
 *    <Controls.dateRange.LiteSelector bind:startValue="_startValue1" bind:endValue="_endValue1" />
 * </pre>
 */

/**
 * @name Controls/_dateRange/RelationController#endValue0
 * @cfg {Date} End value of the first period.
 * @remark
 * You can bind the options endValue0, endValue1, endValue2 in an amount equal to the number of controls you need to associate.
 * @example
 * This example shows how to bind 2 range input controls.
 * <pre>
 *    <Controls.dateRange.RelationController
 *          bind:startValue0="_startValue0"
 *          bind:endValue0="_endValue0"
 *          bind:startValue1="_startValue1"
 *          bind:endValue1="_endValue1"/>
 *    <Controls.dateRange.LiteSelector bind:startValue="_startValue0" bind:endValue="_endValue0" />
 *    <Controls.dateRange.LiteSelector bind:startValue="_startValue1" bind:endValue="_endValue1" />
 * </pre>
 */

/**
 * @name Controls/_dateRange/RelationController#bindType
 * @cfg {String} Bind type
 * @variant 'normal' In this mode, changing one period always results to recalculation of the remaining periods.
 * @variant 'byCapacity' In this mode, when one of the periods changes, the others change only if the type of the period has changed.
 * @example
 * This example shows how to set the bind type.
 * <pre>
 *    <Controls._dateRange.RelationController bind:bindType="_bindType" />
 * </pre>
 * <pre>
 *    Control.extend({
 *       ...
 *       _bindType: 'normal',
 *       ...
 *    });
 * </pre>
 */

/**
 * @event Controls/_dateRange/RelationController#bindTypeChanged Occurs when bind type was changed.
 * @param {String} bindType New bind type value.
 * @example
 * <pre>
 *    <Controls._dateRange.RelationController on:bindTypeChanged="_bindTypeChangedHandler()"/>
 * </pre>
 * <pre>
 *    Control.extend({
 *       ...
 *       _bindTypeChangedHandler(bindType) {
 *          if (bindType === 'normal') {
 *              this._buttonStyle = 'primary'
 *          } else if (bindType === 'byCapacity') {
 *              this._buttonStyle = 'default';
 *          }
 *       },
 *       ...
 *    });
 * </pre>
 */

/**
 * @event Controls/_dateRange/RelationController#periodsChanged Occurs when at least one of the periods has changed.
 * @param {Array} value Array with periods.
 * @example
 * <pre>
 *    <Controls._dateRange.RelationController on:periodsChanged="_periodsChangedHandler()"/>
 * </pre>
 * <pre>
 *    Control.extend({
 *       ...
 *       _periodsChangedHandler(periods) {
 *          this._saveToDatabase(periods);
 *       },
 *       ...
 *    });
 * </pre>
 */

/**
 * Shifts periods forward
 * @function Controls/_dateRange/RelationController#shiftForward
 */

/**
 * Shifts periods backward
 * @function Controls/_dateRange/RelationController#shiftBackward
 */

var _private = {
    notifyRangeChanged: function(self, newRanges, ranges?) {
        let changed = false;
        for (let i in newRanges) {
            if (!ranges || ranges[i][0] !== newRanges[i][0]) {
                self._notify('startValue' + i + 'Changed', [newRanges[i][0]]);
                changed = true;
            }
            if (!ranges || ranges[i][1] !== newRanges[i][1]) {
                self._notify('endValue' + i + 'Changed', [newRanges[i][1]]);
                changed = true;
            }
        }
        self._notify('periodsChanged');
    }
};

var Component = Control.extend({
    _template: template,
    _model: null,

    _beforeMount: function (options) {
        this._model = new Model(options);
    },

    _beforeUpdate: function (options) {
        let ranges = this._model.ranges,
            newRanges;
        this._model.update(options);
        newRanges = this._model.ranges;

        _private.notifyRangeChanged(this, newRanges, ranges);

        if (options.bindType !== this._model.bindType) {
            this._notify('bindTypeChanged', [this._model.bindType]);
        }
    },

    shiftForward: function() {
        this._model.shiftForward();
        _private.notifyRangeChanged(this, this._model.ranges);
    },

    shiftBackward: function() {
        this._model.shiftBackward();
        _private.notifyRangeChanged(this, this._model.ranges);
    },

    _beforeUnmount: function() {
        this._model = null;
    }
});

Component.getDefaultOptions = function () {
    return {
        bindType: 'normal'
    };
};
//
// Component.getOptionTypes = function() {
//    return coreMerge({});
// };

export default Component;
