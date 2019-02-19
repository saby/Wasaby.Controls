/// <amd-module name="Controls/Utils/parking/Handler" />
import Template from 'Controls/Utils/parking/Template';

/**
 * Возвращаемый обработчиком ошибки результат
 * @typedef {Object}
 * @name Controls/_error/types/HandlerResult
 * @property {Function | String} template Шаблон отображения ошибки
 * @property {Object} [options] параметры построяния шаблона ошибки
 */
export type HandlerResult<TOptions = object> = {
    template: Template;
    options?: Partial<TOptions>;
}

/**
 * Обработчик парковочной
 * @typedef {Function}
 * @name Controls/_error/types/Handler
 * @param {*} объект с параметрами
 * @return {void | Controls/_error/types/HandlerResult}
 */
export type Handler<TOptions = object> = (config: any) => HandlerResult<TOptions> | void;
