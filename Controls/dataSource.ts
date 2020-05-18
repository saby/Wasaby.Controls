/// <amd-module name="Controls/dataSource" />
/**
 * Библиотека компонентов для упрощения загрузки данных: формирования запросов, обработки ошибок.
 * @library Controls/dataSource
 * @includes parking Controls/_dataSource/parking
 * @includes error Controls/_dataSource/error
 * @includes requestDataUtil Controls/_dataSource/requestDataUtil
 * @includes SourceCrudInterlayer Controls/dataSource/SourceCrudInterlayer
 * @public
 * @author Северьянов А.А.
 */
import * as parking from 'Controls/_dataSource/parking';
import * as error from 'Controls/_dataSource/error';
import requestDataUtil, {ISourceConfig, IRequestDataResult} from 'Controls/_dataSource/requestDataUtil';

export {parking, error, requestDataUtil, ISourceConfig, IRequestDataResult};
export { CrudWrapper } from './_dataSource/CrudWrapper';
export { default as NavigationController } from './_dataSource/_navigation/Controller';
export { default as QueryParamsController} from './_dataSource/_navigation/QueryParamsController';
export { default as PageQueryParamsController} from './_dataSource/_navigation/PageQueryParamsController';
export { default as PositionQueryParamsController} from './_dataSource/_navigation/PositionQueryParamsController';