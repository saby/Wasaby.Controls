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
 * @demo Controls-demo/dateRange/RelationController
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
 *    <Controls.dateRange:RelationController
 *            bind:startValue0="_startValue0"
 *             bind:endValue0="_endValue0"
 *             bind:startValue1="_startValue1"
 *             bind:endValue1="_endValue1">
 *        <Controls.dateRange:RelationWrapper number="{{0}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:LiteSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *        <Controls.dateRange:RelationWrapper number="{{1}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:LiteSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *    </Controls.dateRange:RelationController>
 * </pre>
 * <pre>
 *    Control.extend({
 *       _startValue0: new Date(2019, 0, 0),
 *       _endValue0: new Date(2019, 0, 31),
 *       _startValue1: new Date(2019, 1, 0),
 *       _endValue1: new Date(2019, 1, 31),
 *    });
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
 *    <Controls.dateRange:RelationController
 *            bind:startValue0="_startValue0"
 *             bind:endValue0="_endValue0"
 *             bind:startValue1="_startValue1"
 *             bind:endValue1="_endValue1">
 *        <Controls.dateRange:RelationWrapper number="{{0}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:LiteSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *        <Controls.dateRange:RelationWrapper number="{{1}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:LiteSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *    </Controls.dateRange:RelationController>
 * </pre>
 * <pre>
 *    Control.extend({
 *       _startValue0: new Date(2019, 0, 0),
 *       _endValue0: new Date(2019, 0, 31),
 *       _startValue1: new Date(2019, 1, 0),
 *       _endValue1: new Date(2019, 1, 31),
 *    });
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
 *    <Controls.dateRange:RelationController bindType="{{_bindType}}">
 *        <Controls.dateRange:RelationButton value="{{content.bindType}}"/>
 *    </Controls.dateRange:RelationController>
 * </pre>
 * <pre>
 *    Control.extend({
 *       _bindType: 'normal'
 *    });
 * </pre>
 */

/**
 * @name Controls/_dateRange/RelationController#content
 * @cfg {Content} Component contents. The controller set the period and type of relation options on the template.
 * An internal template can contain period selection components. Each of the period selection component
 * must be wrapped in {@link Controls/_dateRange/RelationWrapper}. Also the template may contain a {@link Controls/_dateRange/RelationButton}.
 * @example
 * <pre>
 *    <Controls.dateRange:RelationController
 *            bind:startValue0="_startValue0"
 *             bind:endValue0="_endValue0"
 *             bind:startValue1="_startValue1"
 *             bind:endValue1="_endValue1">
 *        <Controls.dateRange:RelationWrapper number="{{0}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:LiteSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *        <Controls.dateRange:RelationWrapper number="{{1}}" ranges="{{content.ranges}}">
 *            <Controls.dateRange:LiteSelector/>
 *        </Controls.dateRange:RelationWrapper>
 *        <Controls.dateRange:RelationButton value="{{content.bindType}}"/>
 *    </Controls.dateRange:RelationController>
 * </pre>
 * <pre>
 *    Control.extend({
 *       _startValue0: new Date(2019, 0, 0),
 *       _endValue0: new Date(2019, 0, 31),
 *       _startValue1: new Date(2019, 1, 0),
 *       _endValue1: new Date(2019, 1, 31),
 *    });
 * </pre>
 */

/**
 * @event Controls/_dateRange/RelationController#bindTypeChanged Occurs when bind type was changed.
 * @param {String} bindType New bind type value.
 * @example
 * <pre>
 *    <Controls.dateRange:RelationController on:bindTypeChanged="_bindTypeChangedHandler()"/>
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
 *    <Controls.dateRange:RelationController on:periodsChanged="_periodsChangedHandler()"/>
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
 * @example
 * <pre>
 *    <Controls.dateRange:RelationController name="dateRelation"/>
 *    <Controls.buttons:Button on:click="dateRelation.shiftForward()"/>
 * </pre>
 */

/**
 * Shifts periods backward
 * @function Controls/_dateRange/RelationController#shiftBackward
 * @example
 * <pre>
 *    <Controls.dateRange:RelationController name="dateRelation"/>
 *    <Controls.buttons:Button on:click="dateRelation.shiftBackward()"/>
 * </pre>
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
        if (changed) {
            self._notify('periodsChanged');
        }
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
        if (options.bindType !== this._options.bindType) {
            this._model.bindType = options.bindType;
        }

        this._model.update(options);
        newRanges = this._model.ranges;

        _private.notifyRangeChanged(this, newRanges, ranges);

        if (options.bindType !== this._model.bindType) {
            this._notify('bindTypeChanged', [this._model.bindType]);
        }
    },

    _onRelationWrapperRangeChanged: function(event, start, end, controlNumber) {
        let ranges = this._model.ranges,
            oldBindType = this._model.bindType;
        this._model.updateRanges(start, end, controlNumber);
        _private.notifyRangeChanged(this, this._model.ranges, ranges);
        if (oldBindType !== this._model.bindType) {
            this._notify('bindTypeChanged', [this._model.bindType]);
        }
    },

    _onRelationButtonBindTypeChanged: function(event, bindType) {
        if (bindType !== this._model.bindType) {
            this._model.bindType = bindType;
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
