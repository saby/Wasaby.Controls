/// <amd-module name="Controls/_dataSource/error" />
/**
 * Набор модулей необходимых для обработки и отображения ошибок
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/handling-errors/}
 * @library Controls/_dataSource/error
 * @include Controller Controls/_dataSource/_error/Controller
 * @include Container Controls/_dataSource/_error/Container
 * @include Mode Controls/_dataSource/_error/Mode
 * @include DefaultTemplate Controls/_dataSource/_error/DefaultTemplate
 * @include Handler Controls/_dataSource/_error/Handler
 * @include ViewConfig Controls/_dataSource/_error/ViewConfig
 * @private
 * @author Заляев А.В.
 */

export {
    Handler,
    ViewConfig,
    HandlerConfig
} from 'Controls/_dataSource/_error/Handler';
export { default as Controller, Config } from 'Controls/_dataSource/_error/Controller';
export { default as Mode } from 'Controls/_dataSource/_error/Mode';
export { default as DefaultTemplate } from 'Controls/_dataSource/_error/DefaultTemplate';
export { default as Container } from 'Controls/_dataSource/_error/Container';
