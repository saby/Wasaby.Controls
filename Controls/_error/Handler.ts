/// <amd-module name="Controls/_error/Handler" />
import { Mode, Template } from 'Controls/_error/Const';

/**
 * Возвращаемый обработчиком ошибки результат
 * @typedef {Object} HandlerResult
 * @property {Function | String} template Шаблон отображения ошибки
 * @property {Object} [options] параметры построяния шаблона ошибки
 */
export type HandlerResult<TOptions = object> = {
    template: Template;
    mode?: Mode;
    options?: Partial<TOptions>;
}
/**
 * Передаваемые в обработчик параметры
 * @typedef HandlerConfig
 * @property {'page' | 'dialog', 'include'} mode Способ отображения ошибки (на всё окно / диалог / внутри компонента)
 * @property {Error} Обрабатываемая ошибка
 */
export type Args<T extends Error = Error> = {
    error: T | Error;
    mode: Mode;
}

/**
 * Передаваемые в обработчик параметры
 * @typedef {Object} IncludeModeHandlerConfig
 * @extends HandlerConfig
 * @property {'include'} mode
 * @property {Function} showError Функция обратного вызова, отвечающая за отображениерезультирующего шаблона с ошибкой
 */
export type IncludeMode = {
    mode: Mode.include;
    showError(template: Template, options): Promise<void>
}
export type IncludeModeHandlerConfig<T extends Error> = Args<T> & IncludeMode;

/**
 * Передаваемые в обработчик параметры
 * @typedef {Object} DialogModeHandlerConfig
 * @extends HandlerConfig
 * @property {'dialog'} mode
 */
export type DialogMode = {
    mode: Mode.dialog
}
export type DialogModeHandlerConfig<T extends Error> = Args<T> & DialogMode;

/**
 * Передаваемые в обработчик параметры
 * @typedef {Object} PageModeHandlerConfig
 * @extends HandlerConfig
 * @property {'page'} mode
 */
export type PageMode = {
    mode: Mode.page
}
export type PageModeHandlerConfig<T extends Error> = Args<T> & PageMode;

export type HandlerConfig<T extends Error> =
    IncludeModeHandlerConfig<T> |
    PageModeHandlerConfig<T> |
    DialogModeHandlerConfig<T>;

/**
 * Обработчик ошибки
 * @typedef {Function} Handler
 * @param {HandlerConfig} объект с параметрами
 * @return {void | HandlerResult}
 */
export type Handler<
    TError extends Error = Error,
    TOptions = object
> = (config: HandlerConfig<TError>) => HandlerResult<TOptions> | void;
