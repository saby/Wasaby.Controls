/// <amd-module name="Controls/_error/types/Control" />
// @ts-ignore
import * as CoreControl from 'Core/Control';

/**
 * Прослойка для нормальной работы с Core/Control в ts
 * выпилить
 */
declare class IControl {
    constructor(...args)
    subscribe(event: string, handler);
    protected _notify(eventName: string, args?: Array<any>, options?: { bubbling: boolean });
    protected _children;
    protected _template;
    protected _beforeMount(...args): any;
}
declare type ControlConstructor = {
    new(...args): IControl
}

let Control: ControlConstructor = CoreControl;

export default Control;
