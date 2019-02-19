/// <amd-module name="Controls/Utils/ParkingController" />
import { Handler, HandlerResult } from 'Controls/Utils/parking/Handler';

type Config = {
    handlers?: Array<Handler>
}

/// region helpers
let getApplicationHandlers = (): Array<Handler> => {
    // TODO get from Application.Config
    return []
};

let findTemplate = (
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
 * @class
 * @name Controls/Utils/ParkingController
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
 *         let parking = parkingController.process(result);
 *         if (parking) {
 *             return this.__showParking(parking)
 *         }
 *         this.__showResult(result)
 *     })
 * </pre>
 */
class ParkingController{
    private __handlers: Array<Handler>;
    constructor(config: Config) {
        this.__handlers = config.handlers || [];
    }
    destroy() {
        delete this.__handlers;
    }

    /**
     * @method
     * @name Controls/Utils/ParkingController#addHandler
     * @public
     * @param {Controls/Utils/parking/Handler} handler
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
     * @name Controls/Utils/ParkingController#removeHandler
     * @public
     * @param {Controls/Utils/parking/Handler} handler
     * @void
     */
    removeHandler(handler: Handler): void {
        this.__handlers = this.__handlers.filter((_handler) => {
            return handler !== _handler;
        })
    }

    /**
     * @method
     * @name Controls/Utils/ParkingController#process
     * @public
     * @param {*} config
     * @return {void | Controls/Utils/parking/HandlerResult}
     */
    process(config: any): DisplayOptions {
        return findTemplate<T>(this.__handlers, config) || // find in own handlers
            findTemplate<T>(getApplicationHandlers(), config);// find in Application  handlers
    }
}

export = ParkingController;
