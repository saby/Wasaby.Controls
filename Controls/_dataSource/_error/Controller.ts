/// <amd-module name="Controls/_dataSource/_error/Controller" />
import { Controller as ParkingController } from 'Controls/_dataSource/parking';
import {
    Handler,
    HandlerConfig,
    ViewConfig
} from 'Controls/_dataSource/_error/Handler';
import Mode from 'Controls/_dataSource/_error/Mode';
import { fetch } from 'Browser/Transport';
import { IVersionable } from 'Types/entity';

const { Errors } = fetch;
const { Abort } = Errors;

export type Config = {
    handlers?: Array<Handler>
}

/// region helpers
let getIVersion = (): IVersionable => {
    const id: number = Math.random();
    /*
     * неоходимо для прохождения dirty-checking при схранении объекта на инстансе компонента,
     * для дальнейшего его отображения через прокидывание параметра в Container
     * в случа, когда два раза пришла одна и та же ошибка, а между ними стейт не менялся
     */
    return {
        '[Types/_entity/IVersionable]': true,
        getVersion(): number {
            return id;
        }
    }
};

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
 * Модуль для выбора обработчика ошибки и формирования объекта с данными для шаблона ошибки.
 * @class Controls/_dataSource/_error/Controller
 * @public
 * @author Санников К.А.
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
     * Добавить обработчик ошибки
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
     * Убрать обработчик ошибки
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
     * Запуск обработки ошибки для формирования объекта с данными для шаблона ошибки.
     * @method
     * @name Controls/_dataSource/_error/Controller#process
     * @public
     * @param {Error | Controls/_dataSource/_error/HandlerConfig} config Объект, содержащий обрабатываемую ошибку и предпочитаемый режим отображения, лио обрабатываемая ошибка
     * @return {void | Controls/_dataSource/_error/ViewConfig} Данные для отображения шаблона
     */
    process<T extends Error = Error>(config: HandlerConfig<T> | T): Promise<ViewConfig | void> {
        let _config = prepareConfig<T>(config);
        if (!isNeedHandle(_config.error)) {
            return Promise.resolve();
        }
        return this.__controller.process(_config).then((handlerResult: ViewConfig | void) => {
            if (!handlerResult) {
                return this._getDefault(_config);
            }
            // @ts-ignore
            _config.error.processed = true;
            return {
                mode: handlerResult.mode || _config.mode,
                template: handlerResult.template,
                options: handlerResult.options,
                ...getIVersion()
            };
        });
    }

    private _getDefault<T extends Error = Error>(config: HandlerConfig<T>): void {
        const message = config.error.message;
        const style = 'danger';
        const type = 'ok';
        // @ts-ignore
        import('Controls/popup').then((popup) => { popup.Confirmation.openPopup({ type, style, message }); });
    }

}
