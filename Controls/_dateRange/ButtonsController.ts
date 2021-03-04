import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_dateRange/ButtonsController/ButtonsController';
import {RegisterClass} from 'Controls/event';

/**
 * Контрол-обертка для связи выбора периода и кнопок-стрелок, которые будут сдвигать период.
 *
 * @class Controls/_dateRange/ButtonsController
 * @public
 * @author Красильников А.С.
 * @demo Controls-demo/dateRange/ButtonsController/Index
 * @see Controls/_dateRange/Button
 */

/**
 * @name Controls/_dateRange/ButtonsController#content
 * @cfg {TemplateFunction} Пользовательский шаблон.
 * @remark
 * В шаблон будут переданы контентные опции
 * <ul>
 *     <li>prevButtonTemplate - Кнопка-стрелка указывающая влево</li>
 *     <li>nextButtonTemplate - Кнопка-стрелка указывающая вправо</li>
 * </ul>
 * @example
 * <pre>
 *     <Controls.dateRange:ButtonsController>
 *         <Controls.dateRange:Button direction="left"/>
 *         <Controls.dateRange:RangeSelector bind:startValue="_startValue" bind:endValue="_endValue"/>
 *         <Controls.dateRange:Button direction="right"/>
 *     </Controls.dateRange:ButtonsController>
 * </pre>
 */

export default class ButtonsController extends Control {
    protected _template: TemplateFunction = template;
    private _register: RegisterClass;

    protected _beforeMount(): void {
        this._register = new RegisterClass({ register: 'shiftDateRangePeriod' });
    }

    protected _shiftPeriod(event: Event, direction: string): void {
        if (direction === 'left') {
            this._shiftBack();
        } else {
            this._shiftForward();
        }
    }

    protected _beforeUnmount(): void {
        this._register.destroy();
    }

    private _shiftBack(): void {
        this._register.start(-1);
    }

    private _shiftForward(): void {
        this._register.start(1);
    }

    protected _registerIt(event: Event, registerType: string, component: Control, callback: Function): void {
        this._register.register(event, registerType, component, callback);
    }
}
