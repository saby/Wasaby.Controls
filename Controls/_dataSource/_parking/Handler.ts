/// <amd-module name="Controls/_dataSource/_parking/Handler" />

/**
 * Возвращаемый обработчиком парковочной результат
 * @interface Controls/_dataSource/_parking/ViewConfig
 * @public
 * @author Санников К.А.
 */
export interface ViewConfig<TOptions = object> {
    /**
     * @name Controls/_dataSource/_parking/ViewConfig#template
     * @cfg {Function | String} Шаблон отображения ошибки
     */
    template: any;
    /**
     * @name Controls/_dataSource/_parking/ViewConfig#options
     * @cfg {Object} параметры построяния шаблона ошибки
     */
    options?: Partial<TOptions>;
}

/**
 * Обработчик парковочной
 * @interface Controls/_dataSource/_parking/Handler
 * @public
 * @author Санников К.А.
 */
export type Handler<TOptions = object> = (config: any) => ViewConfig<TOptions> | void;

/**
 * Обработчик парковочной
 * @function
 * @name Controls/_dataSource/_parking/Handler#function
 * @param {*} объект с параметрами
 * @return {void | Controls/_dataSource/_parking/ViewConfig}
 */