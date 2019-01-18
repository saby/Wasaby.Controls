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
type CoreControlType = {
    subscribe(event: string, handler);
    _notify(eventName: string, args?: Array<any>, options?: { bubbling: boolean });
}
export type CoreControlConstructor = {
    new(...args): CoreControlType;
}
/// endregion type difinition - delete
