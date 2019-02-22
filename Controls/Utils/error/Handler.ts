/// <amd-module name="Controls/Utils/error/Handler" />
import Mode = require('Controls/Utils/error/Mode');
import {
    HandlerResult as ParkingHandlerResult
} from 'Controls/Utils/parking/Handler';

/**
 * Возвращаемый обработчиком ошибки результат
 * @typedef {Object}
 * @name Controls/Utils/error/HandlerResult
 * @property {Function | String} template Шаблон отображения ошибки
 * @property {Object} [options] параметры построяния шаблона ошибки
 * @property {Controls/Utils/error/Mode} [mode]
 */
export type HandlerResult<TOptions = object> = ParkingHandlerResult<TOptions> & {
    mode?: Mode;
}

export type DisplayOptions<TOptions = object> = Required<HandlerResult<TOptions>> & {
    error: Error;
};

/**
 * Передаваемые в обработчик параметры
 * @typedef {Object}
 * @name Controls/Utils/error/HandlerConfig
 * @property {Controls/Utils/error/Mode} mode Способ отображения ошибки (на всё окно / диалог / внутри компонента)
 * @property {Error} Обрабатываемая ошибка
 */
export type HandlerConfig<T extends Error = Error> = {
    error: T | Error;
    mode: Mode;
}

/**
 * Обработчик ошибки
 * @typedef {Function}
 * @name Controls/Utils/error/Handler
 * @param {HandlerConfig} объект с параметрами
 * @return {void | Controls/Utils/error/HandlerResult}
 */
export type Handler<
    TError extends Error = Error,
    TOptions = object
> = (config: HandlerConfig<TError>) => HandlerResult<TOptions> | void;
