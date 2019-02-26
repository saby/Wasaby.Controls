/// <amd-module name="Controls/_dataSource/_parking/Controller" />
import { Handler, ViewConfig } from 'Controls/_dataSource/_parking/Handler';
// @ts-ignore
import { constants, IoC } from 'Env/Env';
// @ts-ignore
import { load } from 'Core/library';

export type Config = {
    handlers?: Array<Handler>;
    configField: string;
}
const DEFAULT: Partial<Config> = {
    handlers: [],
    configField: 'parkingHandlers'
};
let ApplicationConfig = constants.ApplicationConfig || {};

/// region helpers
let log = (message) => {
    IoC.resolve('ILogger').log(
        "Controls/_dataSource/_parking/Controller",
        message
    );
};
let getApplicationHandlers = (handlersField: string): Array<Handler | string> => {
    let handlers = ApplicationConfig[handlersField];
    if (!Array.isArray(handlers)) {
        log(`ApplicationConfig:${handlersField} must be Array<Function>`);
        return [];
    }
    return handlers;
};

let getHandler = (handler: Handler | string): Promise<Handler> => {
    if (typeof handler === 'string') {
        return load(handler);
    }
    if (typeof handler === 'function') {
        return Promise.resolve(handler);
    }
    return Promise.reject(new Error('handler must be string|function'));
};
let findTemplate = (
    handlers: Array<Handler | string>,
    config: any
): Promise<ViewConfig | void> => {
    let position: number = 0;
    let fire = () => {
        return getHandler(handlers[position]).then((handler: Handler) => {
            let result = handler(config);
            if (result) {
                return result;
            }
            position++;
            if (position < handler.length) {
                return fire();
            }
        }, (error: Error) => {
            log(error);
        })
    };
    return fire();
};
/// endregion helpers

/**
 * @class
 * @name Controls/_dataSource/_parking/Controller
 * @public
 * @author Zalyaev A.V.
 * @example
 * <pre>
 *     let handler = (config) => {
 *         if (needShowParking(config)) {
 *             return {
 *                 template: ParkingTemplate,
 *                 options: {
 *                     // ...
 *                 }
 *             }
 *         }
 *     };
 *     let parkingController = new ParkingController({
 *         handlers: [handler]
 *     });
 *
 *     this.load().then((result) => {
 *         return  parkingController.process(result).then((parking) => {
 *             if (parking) {
 *                 return this.__showParking(parking);
 *             }
 *             return this.__showResult(result);
 *         });
 *     });
 * </pre>
 */
export default class ParkingController {
    private __handlers: Array<Handler>;
    private __configField: string;
    constructor(config: Config) {
        let cfg = { ...DEFAULT, ...config };
        this.__handlers = cfg.handlers;
        this.__configField = cfg.configField;
    }
    destroy() {
        delete this.__handlers;
    }

    /**
     * @method
     * @name Controls/_dataSource/_parking/Controller#addHandler
     * @public
     * @param {Controls/_dataSource/_parking/Handler} handler
     * @void
     */
    addHandler(handler: Handler): void {
        if (this.__handlers.indexOf(handler) >= 0) {
            return;
        }
        this.__handlers.push(handler);
    }

    /**
     * @method
     * @name Controls/_dataSource/_parking/Controller#removeHandler
     * @public
     * @param {Controls/_dataSource/_parking/Handler} handler
     * @void
     */
    removeHandler(handler: Handler): void {
        this.__handlers = this.__handlers.filter((_handler) => {
            return handler !== _handler;
        });
    }

    /**
     * @method
     * @name Controls/_dataSource/_parking/Controller#process
     * @public
     * @param {*} config
     * @return {Promise.<void | Controls/_dataSource/_parking/ViewConfig>}
     */
    process(config: any): Promise<ViewConfig | void> {
        // find in own handlers
        return findTemplate(this.__handlers, config).then((result: ViewConfig | void) => {
            if (result) {
                return result;
            }
            // find in Application  handlers
            return findTemplate(getApplicationHandlers(this.__configField), config);
        });
    }
}
