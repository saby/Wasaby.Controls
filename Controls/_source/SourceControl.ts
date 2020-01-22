import {ICrud, Query, DataSet} from 'Types/source';
import {Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';
import {Logger} from 'UI/Utils';
import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {error as ErrorModule} from 'Controls/dataSource';
import {IErrorController} from 'Controls/interface';

import * as cInstance from 'Core/core-instance';

import * as template from 'Controls/_source/SourceControl/SourceControl';

interface IErrorConfig {
    mode?: ErrorModule.Mode;
    dataLoadErrback?: (error: Error) => any;
}

interface ISSRSourceControlState {
    data: any;
    errorConfig?: ErrorModule.ViewConfig;
}

export type ISourceControlState = ISSRSourceControlState | DataSet | Record;

export interface ICrudControlOption extends IControlOptions {
    source: ICrud;
    initialMethod: CRUD_METHODS;
    initialMethodArgs: any[];
    content?: TemplateFunction;
    errorController?: ErrorModule.Controller;
    errorConfig: IErrorConfig;
}

export interface ICrudControlChildren {
    errorController: ErrorModule.Container;
}

export enum CRUD_METHODS {
    create = 'create',
    read = 'read',
    update = 'update',
    delete = 'delete',
    query = 'query'
}

export class SourceControlCrudFactory implements ICrud {
    readonly '[Types/_source/ICrud]': true;
    private _source: ICrud;

    constructor(source: ICrud) {
        this._source = source;
    }

    /**
     * Создает пустую запись через источник данных (при этом она не сохраняется в хранилище)
     * @param [meta] Дополнительные мета данные, которые могут понадобиться для создания записи
     * @return Асинхронный результат выполнения: в случае успеха вернет {@link Types/_entity/Record} - созданную запись, в случае ошибки - Error.
     * @see Types/source/ICrud#create
     */
    create(meta?: object): Promise<Record> {
        return this._source.create(meta);
    }

    /**
     * Читает запись из источника данных
     * @param key Первичный ключ записи
     * @param [meta] Дополнительные мета данные
     * @return Асинхронный результат выполнения: в случае успеха вернет {@link Types/_entity/Record} - прочитанную запись, в случае ошибки - Error.
     * @see Types/source/ICrud#read
     */
    read(key: number | string, meta?: object): Promise<Record> {
        return this._source.read(key, meta);
    }

    /**
     * Обновляет запись в источнике данных
     * @param data Обновляемая запись или рекордсет
     * @param [meta] Дополнительные мета данные
     * @return Асинхронный результат выполнения: в случае успеха ничего не вернет, в случае ошибки - Error.
     */
    update(data: Record | RecordSet, meta?: object): Promise<null> {
        return this._source.update(data, meta);
    }

    /**
     * Выполняет запрос на выборку
     * @param [query] Запрос
     * @return Асинхронный результат выполнения: в случае успеха вернет {@link Types/_source/DataSet} - прочитаннные данные, в случае ошибки - Error.
     * @see Types/source/ICrud#query
     */
    query(query?: Query): Promise<DataSet> {
        return this._source.query(query);
    }

    /**
     * Удаляет запись из источника данных
     * @param keys Первичный ключ, или массив первичных ключей записи
     * @param [meta] Дополнительные мета данные
     * @return Асинхронный результат выполнения: в случае успеха ничего не вернет, в случае ошибки - Error.
     */
    destroy(keys: number | string | number[] | string[], meta?: object): Promise<null> {
        return this._source.destroy(keys, meta);
    }

    /**
     * Выполняет переданный метод с
     * @param methodName
     * @param config
     * @param args
     * @private
     */
    call(methodName: CRUD_METHODS, args: any[]): Promise<DataSet | Record> {
        if (typeof this[methodName] === undefined) {
            Logger.error('You are trying to call non-CRUD method. Correct methods are create, read, update, destroy and query', 'Controls/source/SourceControl');
        }
        return this[methodName](...args);
    }
}

/**
 * Source:Control
 * Контрол который показывает либо загруженный контент, либо картинку с ошибкой, если запрос отработал с ошибокй.
 *
 *  Этот контрол должен вставляться везде где есть работа с сорсом, т.е. в
 *  • Списках (Controls/_list/List.ts and Controls/_list/ListView.ts)
 *  • formController (Controls/_form/FormController.ts)
 *  • dataSource/error/DataLoader (Controls/_dataSource/_error/DataLoader.ts and Controls/_dataSource/requestDataUtil.ts)
 *
 *  Он принимает на вход source: ICrud, к которому обращается и сам обладает crudApi.
 *
 *  При возникновении ошибок показывает заглушку сконфигурированную при помощи
 *  Controls.dataSource:error.Container
 *
 *  • Судя по всему в NavigationController всегда вместо ICrud будет попадать CrudControl
 *  TODO Controls/_list/BaseControl.ts выводит ошибку, вызывая _showError, полученную в beforeMount в ReceivedState. Я смогу её получить тут, если использую beforeMount?
 */
export default class SourceControl extends Control<ICrudControlOption, ISourceControlState> implements IErrorController {
    readonly '[Controls/_interface/IErrorController]': true;

    protected _template: TemplateFunction = template;
    protected _options: ICrudControlOption | null;
    protected _children: ICrudControlChildren;
    private _error: ErrorModule.ViewConfig;

    private readonly _source: ICrud;
    private readonly _errorController: ErrorModule.Controller;

    constructor(cfg: ICrudControlOption) {
        super(cfg);
        this._options = cfg;
        if (SourceControl._isValidCrudSource(this._options.source)) {
            this._source = this._options.source;
        }
        this._errorController = cfg.errorController || new ErrorModule.Controller({});
    }

    protected _beforeMount(options?: ICrudControlOption, contexts?: object, receivedState?: ISourceControlState): Promise<ISourceControlState> | void {
        const { errorConfig, data } = receivedState as ISSRSourceControlState;
        if (!receivedState) {
            return this._callCrudMethod(options.initialMethod, options.initialMethodArgs, options.errorConfig);
        }
        if (errorConfig) {
            return this._showError(errorConfig);
        }
        if (data) {
            return data;
        }
        Logger.warn('Component SourceControl did not show anything');
    }

    /**
     * При разрушении контрола разрушает также и errorController
     */
    destroy(): void {
        this._errorController.destroy();
        super.destroy();
    }

    /**
     * Вызывает метод CRUD в source по его имени и с указанными параметрами
     * @param methodName Название метода CRUD
     * @param args аргументы для передачи в метод
     * @param errorConfig Конфигурация отображения ошибки
     * @private
     */
    private _callCrudMethod(methodName: CRUD_METHODS, args: any[], errorConfig: IErrorConfig): Promise<ISourceControlState>  {
        this._hideError();
        const crudControllerFactory = new SourceControlCrudFactory(this._source);
        return crudControllerFactory.call(methodName, args)
            .catch((error) => {
                if (errorConfig.dataLoadErrback instanceof Function) {
                    errorConfig.dataLoadErrback(error);
                }
                return this._processError(error, errorConfig.mode);
            });
    }

    _processError(error: Error, mode?: ErrorModule.Mode): Promise<ISourceControlState> {
        return this._errorController.process({
            error,
            mode: mode || ErrorModule.Mode.include
        }).then((errorViewConfig: ErrorModule.ViewConfig) => {
            this._showError(errorViewConfig);
            return {
                errorConfig: errorViewConfig,
                data: error
            };
        });
    }

    /**
     * Показывает текущую ошибку
     * @param config
     * @private
     */
    private _showError(config: ErrorModule.ViewConfig): void {
        this._error = config;
    }

    /**
     * Скрывает текущую ошибку
     * @private
     */
    private _hideError(): void {
        if (this._error) {
            this._error = null;
        }
    }

    /**
     * Валидатор, позволяющий убедиться, что для source был точно передан Types/_source/ICrud
     * @param {Types/source:ICrud} source
     * @private
     */
    private static _isValidCrudSource(source: ICrud): boolean {
        if (!cInstance.instanceOfMixin(source, 'Types/_source/ICrud')) {
            Logger.error('NavigationController: Source option has incorrect type');
            return false;
        }
        return true;
    }
}
