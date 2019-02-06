/// <amd-module name="Controls/Utils/ErrorController" />
import ParkingController = require('Controls/Utils/ParkingController');
import {
    Handler,
    HandlerConfig,
    HandlerResult,
    DisplayOptions
} from 'Controls/Utils/error/Handler';
import Mode = require('Controls/Utils/error/Mode');
// @ts-ignore
import { Abort } from 'Transport/Errors';

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
/// endregion helpers

/**
 * Error handling component
 * @class
 * @name Controls/Utils/ErrorController
 * @public
 * @author Zalyaev A.V.
 * @example
 * <pre>
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
 *     let errorController = new ErrorController({
 *         handlers: [handler]
 *     });
 *
 *     this.load().catch((error) => {
 *         let errorDisplayOptions = errorController.process(error);
 *         if (!errorDisplayOptions) {
 *             return;
 *         }
 *         this.__showError(errorDisplayOptions);
 *     })
 * </pre>
 */
class ErrorController {
    private __controller: ParkingController;
    constructor(config: Config) {
        this.__controller = new ParkingController(config);
    }
    destroy() {
        this.__controller.destroy();
        delete this.__controller;
    }

    /**
     * @method
     * @name Controls/Utils/ErrorController#addHandler
     * @public
     * @param {Controls/Utils/error/Handler} handler
     * @void
     */
    addHandler(handler: Handler): void {
        this.__controller.addHandler(handler);
    }

    /**
     * @method
     * @name Controls/Utils/ErrorController#removeHandler
     * @public
     * @param {Controls/Utils/error/Handler} handler
     * @void
     */
    removeHandler(handler: Handler): void {
        this.__controller.removeHandler(handler);
    }

    /**
     * @method
     * @name Controls/Utils/ErrorController#process
     * @public
     * @param {Error | Controls/Utils/error/HandlerConfig} config
     * @return {void | Controls/Utils/error/DisplayOptions}
     */
    process<T extends Error = Error>(config: HandlerConfig<T> | T): DisplayOptions {
        let _config = prepareConfig<T>(config);
        if (!isNeedHandle(_config.error)) {
            return;
        }
        let handlerResult = this.__controller.process(_config);
        if (!handlerResult) {
            return;
        }
        return {
            mode: handlerResult.mode || _config.mode,
            error: _config.error,
            template: handlerResult.template,
            options: handlerResult.options
        };
    }
}

export = ErrorController;
