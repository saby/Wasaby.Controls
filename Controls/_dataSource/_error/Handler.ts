/// <amd-module name="Controls/_dataSource/_error/Handler" />
import Mode from 'Controls/_dataSource/_error/Mode';
import {
    ViewConfig as ParkingViewConfig
} from 'Controls/_dataSource/_parking/Handler';
import { IVersionable } from 'Types/entity';

/**
 * Возвращаемый обработчиком ошибки результат
 * @typedef {Object} Controls/_dataSource/_error/ViewConfig
 * @property {String} template Шаблон отображения ошибки
 * @property {Object} [options] параметры построяния шаблона ошибки
 * @property {Controls/_dataSource/_error/Mode} [mode]
 * @extends Types/entity:IVersionable
 * @public
 * @author Санников К.А.
 */
export interface ViewConfig<TOptions = object> extends ParkingViewConfig<TOptions>, IVersionable {
    mode?: Mode;
}

/**
 * Передаваемые в обработчик параметры
 * @typedef {Object} Controls/_dataSource/_error/HandlerConfig
 * @property {Controls/_dataSource/_error/Mode} mode Способ отображения ошибки (на всё окно / диалог / внутри компонента)
 * @property {Error} Обрабатываемая ошибка
 * @public
 * @author Санников К.А.
 */
export interface HandlerConfig<T extends Error = Error> {
    error: T | Error;
    mode: Mode;
}

/**
 * Обработчик ошибки
 * @typedef {Function} Controls/_dataSource/_error/Handler
 * @param {HandlerConfig} объект с параметрами
 * @return {void | Controls/_dataSource/_error/ViewConfig}
 * @public
 * @author Санников К.А.
 */
export type Handler<
    TError extends Error = Error,
    TOptions = object
> = (config: HandlerConfig<TError>) => ViewConfig<TOptions> | void;
