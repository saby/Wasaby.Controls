/// <amd-module name="Controls/_dataSource/_error/Controller" />
import { Controller as ParkingController } from 'Controls/_dataSource/parking';
import {
    Handler,
    HandlerConfig,
    ViewConfig
} from 'Controls/_dataSource/_error/Handler';
import Mode from 'Controls/_dataSource/_error/Mode';
// @ts-ignore
import { Abort } from 'Transport/Errors';

export type Config = {
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

let getDefault = <T extends Error = Error>(config: HandlerConfig<T>) => {
    let message = config.error.message;
    // @ts-ignore
    let details = config.error.details;
    return {
        mode: Mode.dialog,
        template: "Controls/dataSource:error.DefaultTemplate",
        options: {
            message,
            details
        }
    }
};
/// endregion helpers

/**
 * Error handling component
 * @class
 * @name Controls/_dataSource/_error/Controller
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
 *         return errorController.process(error).then((parking) => {
 *             if (!parking) {
 *                 return;
 *             }
 *             return this.__showError(parking);
 *         });
 *     })
 * </pre>
 */
export default class ErrorController {
    private __controller: ParkingController;
    constructor(config: Config) {
        this.__controller = new ParkingController({
            configField: 'errorHandlers',
            ...config
        });
    }
    destroy() {
        this.__controller.destroy();
        delete this.__controller;
    }

    /**
     * @method
     * @name Controls/_dataSource/_error/Controller#addHandler
     * @public
     * @param {Controls/_dataSource/_error/Handler} handler
     * @void
     */
    addHandler(handler: Handler): void {
        this.__controller.addHandler(handler);
    }

    /**
     * @method
     * @name Controls/_dataSource/_error/Controller#removeHandler
     * @public
     * @param {Controls/_dataSource/_error/Handler} handler
     * @void
     */
    removeHandler(handler: Handler): void {
        this.__controller.removeHandler(handler);
    }

    /**
     * @method
     * @name Controls/_dataSource/_error/Controller#process
     * @public
     * @param {Error | Controls/_dataSource/_error/HandlerConfig} config
     * @return {void | Controls/_dataSource/_error/ViewConfig}
     */
    process<T extends Error = Error>(config: HandlerConfig<T> | T): Promise<ViewConfig | void> {
        let _config = prepareConfig<T>(config);
        if (!isNeedHandle(_config.error)) {
            return Promise.resolve();
        }
        return this.__controller.process(_config).then((handlerResult: ViewConfig | void) => {
            if (!handlerResult) {
                return getDefault(_config);
            }
            // @ts-ignore
            _config.error.processed = true;
            return {
                mode: handlerResult.mode || _config.mode,
                template: handlerResult.template,
                options: handlerResult.options
            };
        });
    }
}
