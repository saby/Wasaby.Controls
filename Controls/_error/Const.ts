/// <amd-module name="Controls/_error/Const" />
// @ts-ignore
import * as Control from 'Core/Control';
type TemplateFunction = () => string;
type Template = string | TemplateFunction | FunctionConstructor | Control;

export default Template;

export const enum Mode {
    dialog = 'dialog',
    page = 'page',
    include = 'include'
}

export const SHOW_ERROR_EVENT_NAME = 'showError';

export type DisplayOptions = {
    template: Template;
    options: object;
    mode: Mode;
    error: Error;
};

/// region type difinition - delete
type CoreControlType<TChildren = object> = {
    subscribe(event: string, handler);
    _notify(eventName: string, args?: Array<any>, options?: { bubbling: boolean });
    _children: TChildren;
}
export type CoreControlConstructor<TChildren = object> = {
    new(...args): CoreControlType<TChildren>;
}
/// endregion type difinition - delete
