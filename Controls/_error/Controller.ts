/// <amd-module name="Controls/_error/Controller" />
// @ts-ignore
import * as Control from 'Core/Control';
// @ts-ignore
import { Handler, HandlerConfig, HandlerResult } from 'Controls/_error/Handler';
import { Mode, CoreControlConstructor, DisplayOptions } from 'Controls/_error/Const';
// @ts-ignore
import { Abort } from 'Transport/Errors';
// @ts-ignore
import * as DefaultTemplate from 'wml!Controls/_error/Template';

let CoreControl: CoreControlConstructor = Control;

type Config = {
    handlers?: Array<Handler>
}

/// region helpers
let isNeedHandle = (error: Error): boolean => {
    return !(
        (error instanceof Abort) ||
        // @ts-ignore
        error.processed ||
        // @ts-ignore
        error.canceled
    )
};
let getDefaultTemplate = <T extends Error = Error>(config: HandlerConfig<T>): HandlerResult => {
    return {
        mode: Mode.dialog,
        template: DefaultTemplate,
        options: config
    }
};
let prepareConfig = <T extends Error = Error>(config: HandlerConfig<T> | T): HandlerConfig<T> => {
    if (config instanceof Error) {
        return {
            error: <T>config,
            mode: Mode.dialog
        }
    }
    return {
        mode: Mode.dialog,
        ...config
    }
};
let getApplicationHandlers = (): Array<Handler> => {
    // TODO get from Application.Config
    return []
};
let findTemplate = <T extends Error = Error>(
    handlers: Array<Handler>,
    config: HandlerConfig<T>
): HandlerResult | void => {
    for (let i in handlers) {
        if (!handlers.hasOwnProperty(i)) {
            continue;
        }
        let handler = handlers[i];
        let result = handler(config);
        if (result) {
            return result;
        }
    }
};
/// endregion helpers

/**
 * Компонент отвечающий за обработку ошибок
 * @class Controls/_error/Controller
 * @example
 * Template:
 * <pre>
 *     <Controls.error:Controller
 *         name="errorController"
 *     />
 * </pre>
 *
 * <pre>
 *     let errorController = this._children.errorController;
 *     let handler = ({ error, mode }) => {
 *         if (error.code == 423) {
 *             return {
 *                 template: LockedErrorTemplate,
 *                 options: {
 *                     // ...
 *                 }
 *             }
 *         }
 *     };
 *     errorController.addHandler(handler);
 *
 *     this.load().catch((error) => {
 *         errorController.process(error)
 *     })
 * </pre>
 */
export default class Controller extends CoreControl {
    protected __errorHandlers: Array<Handler>;
    constructor(config: Config) {
        super(config);
        this.__errorHandlers = config.handlers || [];
    }
    addHandler(handler: Handler): void {
        if (this.__errorHandlers.indexOf(handler) >= 0) {
            return;
        }
        this.__errorHandlers.push(handler);
    }
    removeHandler(handler: Handler): void {
        this.__errorHandlers = this.__errorHandlers.filter((_handler) => {
            return handler !== _handler;
        })
    }
    process<T extends Error = Error>(config: HandlerConfig<T> | T) {
        let _config = prepareConfig<T>(config);
        if (!isNeedHandle(_config.error)) {
            return;
        }
        let { template, options, mode } = this.__findTemplate(_config);

        let displayOption: DisplayOptions = {
            mode: mode || _config.mode,
            error: _config.error,
            template,
            options
        };
        return this._notify('showError', [displayOption], { bubbling: true });

    }
    private __findTemplate<T extends Error = Error>(config: HandlerConfig<T>): HandlerResult {
        return findTemplate<T>(this.__errorHandlers, config) || // find in own handlers
            findTemplate<T>(getApplicationHandlers(), config) || // find in Application  handlers
            getDefaultTemplate<T>(config); //default value
    }
}
