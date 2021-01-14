import Mode from './Mode';
import {
    ViewConfig as ParkingViewConfig
} from './_parking/Handler';
import { IVersionable } from 'Types/entity';
import { HTTPStatus } from 'Browser/Transport';

/**
 * Данные для отображения сообщения об ошибке.
 * @public
 * @author Северьянов А.А.
 */
export interface ViewConfig<TOptions = object> extends ParkingViewConfig<TOptions>, Partial<IVersionable> {
    /**
     * Способ показа ошибки: в диалоге, в контентной области компонента или во всю страницу.
     */
    mode?: Mode;

    /**
     * Код состояния HTTP, соответствующий ошибке.
     */
    status?: HTTPStatus;

    /**
     * Обработана ли ошибка. Для обработанных ошибок сообщения не выводятся.
     */
    readonly processed?: boolean;
}

export type ProcessedError = Error & { processed?: boolean; };

/**
 * Параметры для функции-обработчика ошибки.
 * @public
 * @author Северьянов А.А.
 */
export interface HandlerConfig<TError extends ProcessedError = ProcessedError> {
    /**
     * Обрабатываемая ошибка.
     */
    error: TError;

    /**
     * Способ отображения ошибки (на всё окно / диалог / внутри компонента)
     */
    mode: Mode;

    /**
     * @name Controls/_dataSource/_error/HandlerConfig#theme
     * @cfg {String} Тема для окон уведомлений, которые контроллер показывает, если не удалось распознать ошибку.
     */
    theme?: string;
}

/**
 * Тип функции-обработчика ошибки.
 * Анализирует ошибку и определяет, какой парковочный шаблон нужно отобразить.
 * @interface Controls/_dataSource/_error/Handler
 * @public
 * @author Северьянов А.А.
 */
export type Handler<
    TError extends Error = Error,
    TOptions = object
> = (config: HandlerConfig<TError>) => ViewConfig<TOptions> | void;

/**
 * Обработчик ошибки
 * @function
 * @name Controls/_dataSource/_error/Handler#function
 * @param {HandlerConfig} объект с параметрами
 * @return {void | Controls/_dataSource/_error/ViewConfig}
 */
