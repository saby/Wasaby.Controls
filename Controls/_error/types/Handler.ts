/// <amd-module name="Controls/_error/types/Handler" />
import Mode from 'Controls/_error/Mode';
import Template from 'Controls/_error/types/Template';

/**
 * Возвращаемый обработчиком ошибки результат
 * @typedef {Object}
 * @name Controls/_error/types/HandlerResult
 * @property {Function | String} template Шаблон отображения ошибки
 * @property {Object} [options] параметры построяния шаблона ошибки
 * @property {Controls/_error/Mode} [mode]
 */
export type HandlerResult<TOptions = object> = {
    template: Template;
    mode?: Mode;
    options?: Partial<TOptions>;
}

/**
 * Передаваемые в обработчик параметры
 * @typedef {Object}
 * @name Controls/_error/types/HandlerConfig
 * @property {Controls/_error/Mode} mode Способ отображения ошибки (на всё окно / диалог / внутри компонента)
 * @property {Error} Обрабатываемая ошибка
 */
export type HandlerConfig<T extends Error = Error> = {
    error: T | Error;
    mode: Mode;
}

/**
 * Обработчик ошибки
 * @typedef {Function}
 * @name Controls/_error/types/Handler
 * @param {HandlerConfig} объект с параметрами
 * @return {void | Controls/_error/types/HandlerResult}
 */
export type Handler<
    TError extends Error = Error,
    TOptions = object
> = (config: HandlerConfig<TError>) => HandlerResult<TOptions> | void;
