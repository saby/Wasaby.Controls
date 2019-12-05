/// <amd-module name="Controls/_dataSource/_parking/Handler" />

/**
 * Возвращаемый обработчиком парковочной результат
 * @typedef {Object} Controls/_dataSource/_parking/ViewConfig
 * @property {Function | String} template Шаблон отображения ошибки
 * @property {Object} [options] параметры построяния шаблона ошибки
 * @public
 * @author Санников К.А.
 */
export interface ViewConfig<TOptions = object> {
    template: any;
    options?: Partial<TOptions>;
}

/**
 * Обработчик парковочной
 * @typedef {Function} Controls/_dataSource/_parking/Handler
 * @param {*} объект с параметрами
 * @return {void | Controls/_dataSource/_parking/ViewConfig}
 * @public
 * @author Санников К.А.
 */
export type Handler<TOptions = object> = (config: any) => ViewConfig<TOptions> | void;
