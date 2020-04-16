/// <amd-module name="Controls/_dataSource/_parking/Controller" />
import { Handler, ViewConfig } from 'Controls/_dataSource/_parking/Handler';
import { constants } from 'Env/Env';
import { load } from 'Core/library';
import { Logger } from 'UI/Utils';

interface IParkingControllerPotions {
    handlers: Handler[];
    configField: string;
}

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

const getDefaultConfig = (): Partial<IParkingControllerPotions> => {
    return {
        handlers: [],
        configField: 'parkingHandlers'
    };
};

/// region helpers
const log = (message) => {
    Logger.info(
        'Controls/_dataSource/_parking/Controller: ' + message
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

/**
 * Выполнять по очереди обработчики ошибок, пока какой-нибудь из них не вернёт результат.
 * @param handlers Обработчики ошибок
 * @param config
 */
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
 * Класс для выбора обработчика ошибки и формирования опций для парковочного компонента.
 * Передаёт ошибку по цепочке функций-обработчиков. Обработчики предоставляются пользователем
 * или берутся из настроек приложения.
 * @class
 * @name Controls/_dataSource/_parking/Controller
 * @public
 * @author Северьянов А.А.
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
export default class ParkingController /** @lends Controls/_dataSource/_parking/Controller.prototype */{
    private _handlers: Handler[];
    private readonly _configField: string;

    constructor(config: Partial<IParkingControllerPotions> = {}) {
        const cfg = { ...getDefaultConfig(), ...config };
        this._handlers = cfg.handlers;
        this._configField = cfg.configField;
    }

    destroy(): void {
        delete this._handlers;
    }

    /**
     * Добавить обработчик ошибки.
     * @param {Controls/_dataSource/_parking/Handler} handler
     * @public
     */
    addHandler(handler: Handler): void {
        if (this._handlers.indexOf(handler) >= 0) {
            return;
        }
        this._handlers.push(handler);
    }

    /**
     * Удалить обработчик ошибки.
     * @param {Controls/_dataSource/_parking/Handler} handler
     * @public
     * @void
     */
    removeHandler(handler: Handler): void {
        this._handlers = this._handlers.filter((_handler) => {
            return handler !== _handler;
        });
    }

    /**
     * Получить опции для парковочной заглушки.
     * @param {*} config
     * @public
     * @returns {Promise.<void | Controls/_dataSource/_parking/ViewConfig>}
     */
    process(config: any): Promise<ViewConfig | void> {
        // find in own handlers
        return findTemplate(this._handlers, config).then((result: ViewConfig | void) => {
            if (result) {
                return result;
            }
            // find in Application  handlers
            return findTemplate(getApplicationHandlers(this._configField), config);
        });
    }
}
