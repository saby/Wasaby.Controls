/// <amd-module name="Controls/_error/types/DisplayOptions" />
import { HandlerResult } from "Controls/_error/types/Handler";

/*
 * @typedef {Object}
 * @name Controls/_error/types/DisplayOptions
 *
 * @property {Function | String} template Шаблон отображения ошибки
 * @property {Object} options параметры построяния шаблона ошибки
 * @property {Controls/_error/Mode} mode
 * @property {Error} error
 */
type DisplayOptions<TOptions = object> = Required<HandlerResult<TOptions>> & {
    error: Error;
};

export default DisplayOptions;
