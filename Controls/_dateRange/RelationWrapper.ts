import Control = require('Core/Control');
import template = require('wml!Controls/_dateRange/RelationWrapper/RelationWrapper');

/**
 * A wrapper for the control of the choice of periods, so that they can be tied. Used in conjunction
 * with a {@link Controls/_dateRange/RelationController RelationController}.
 *
 * @class Controls/_dateRange/RelationWrapper
 * @extends Core/Control
 *
 * @control
 * @public
 * @category Input
 * @author Mironov A.U.
 * @demo Controls-demo/dateRange/RelationController
 *
 */

/**
 * @name Controls/_dateRange/RelationWrapper#content
 * @cfg {Content} Component contents. Must be a component that implement {@link Controls/_dateRange/interfaces/IInput} interface.
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

class Component extends Control {
    private _template: Function = template;

    _onRangeChanged(event, startValue: Date, endValue: Date): void {
        this._notify('rangeChanged', [startValue, endValue]);
        this._notify(
            'relationWrapperRangeChanged',
            [startValue, endValue, this._options.number],
            { bubbling: true });
    }
}

export default Component;
