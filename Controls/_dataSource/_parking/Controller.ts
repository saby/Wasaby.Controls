/// <amd-module name="Controls/_dataSource/_parking/Controller" />
import { Handler, ViewConfig } from 'Controls/_dataSource/_parking/Handler';
// @ts-ignore
import { constants } from 'Env/Env';
// @ts-ignore
import { load } from 'Core/library';
import {Logger} from 'UI/Utils';

export type Config = {
    handlers: Handler[];
    configField: string;
};

/**
 * Загружает модули обработчиков обшибок.
 * Названия модулей обработчиков берутся из поля ApplicationConfig[handlersField].
 * Функция может быть использована для предварительной загрузки обработчиков.
 * Например, это может понадобиться для случая показа ошибки при разрыве соединения.
 * @param handlersField
 */
export const loadHandlers = (handlersField: string): Array<Promise<Handler>> => {
    return getApplicationHandlers(handlersField).map(getHandler);
};

const getDefaultConfig = (): Partial<Config> => {
    return {
        handlers: [],
        configField: 'parkingHandlers'
    };
};

/// region helpers
const log = (message) => {
    Logger.info(
        "Controls/_dataSource/_parking/Controller: " + message
    );
};

const getApplicationConfig = () => {
    return constants.ApplicationConfig || {};
};

const getApplicationHandlers = (handlersField: string): Array<Handler | string> => {
    const applicationConfig = getApplicationConfig();
    const handlers = applicationConfig[handlersField];
    if (!Array.isArray(handlers)) {
        log(`ApplicationConfig:${handlersField} must be Array<Function>`);
        return [];
    }
    return handlers;
};

const getHandler = (handler: Handler | string): Promise<Handler> => {
    if (typeof handler === 'string') {
        return load(handler);
    }
    if (typeof handler === 'function') {
        return Promise.resolve(handler);
    }
    return Promise.reject(new Error('handler must be string|function'));
};

const findTemplate = (
    handlers: Array<Handler | string>,
    config: any
): Promise<ViewConfig | void> => {
    if (!handlers.length) {
        return Promise.resolve();
    }
    let position: number = 0;
    const fire = () => {
        return getHandler(handlers[position]).then((handler: Handler) => {
            const result = handler(config);
            if (result) {
                return result;
            }
            position++;
            if (position < handlers.length) {
                return fire();
            }
        }, (error: Error) => {
            log(error);
        });
    };
    return fire();
};
/// endregion helpers

/**
 * Модуль для выбора обработчика и формирования объекта с данными для шаблона парковочного компонента.
 * @class
 * @name Controls/_dataSource/_parking/Controller
 * @public
 * @author Санников К.А.
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
    constructor(config: Partial<Config> = {}) {
        const cfg = { ...getDefaultConfig(), ...config };
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
