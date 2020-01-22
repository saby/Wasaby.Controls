import {Control, TemplateFunction, IControlOptions} from 'UI/Base';
import {Controller as ErrorController, ViewConfig as ErrorViewConfig, Mode as ErrorMode} from '../Controls/_dataSource/error';
import {Controller as ParkingController} from '../Controls/_dataSource/parking';
import {ISourceOptions} from '../Controls/interface';
import {Dialog} from '../Controls/popup';

import * as template from 'wml!Controls/_dataSource/Controller';

export interface IDataSourceControllerOptions extends IControlOptions {
    errorController: ErrorController;
    parkingController: ParkingController;
    source: ISourceOptions;
}

export interface IDataSourceChildren {
    dialogOpener: Dialog;
}

/**
 * TODO Базовый компонент для работы с ISource
 */
abstract class DataSourceController extends Control<IDataSourceControllerOptions> {
    protected _template: TemplateFunction = template;
    private _errorController: ErrorController;
    private _parkingController: ParkingController;
    protected _error: ErrorViewConfig;
    protected _parking: {};

    protected _children: IDataSourceChildren;

    protected constructor(cfg: IDataSourceControllerOptions) {
        super(cfg);
        this._errorController = cfg.errorController || new ErrorController({});
        this._parkingController = cfg.parkingController || new ParkingController({});
    }

    abstract create(): Promise<any>;

    abstract read(): Promise<any>;

    abstract update(): Promise<any>;

    abstract delete(): Promise<any>;

    private _onresolve() {}

    private _onreject(error: any) {
        this._errorController.process({
            error,
            mode: ErrorMode.include
        }).then((errorTemplate: ErrorViewConfig) => {
            if (!errorTemplate) {
                return;
            }
            this._showError(errorTemplate);
        });
    }

    private _finally(): void {
        this._hideIndicator();
    }

    private _showError(config: ErrorViewConfig): void {
        if (config.mode !== ErrorMode.dialog) {
            // отрисовка внутри компонента
            this._error = config;
            this._forceUpdate();
            return;
        }

        // диалоговое с ошибкой
        this._children.dialogOpener.open({
            template: config.template,
            templateOptions: config.options
        });
    }

    private _hideError(): void {
        if (this._error) {
            this._error = null;
            this._forceUpdate();
        }
        if (
            this._children &&
            this._children.dialogOpener &&
            this._children.dialogOpener.isOpened()
        ) {
            this._children.dialogOpener.close();
        }
    }

    private _beforeCall(): void {
        this._hideError();
        this._showIndicator();
    }
}

/*
<div class="controls-DataSourceContainer">
    <Controls.popup:Dialog name="dialogOpener" />
    <ws:if data="{{ _error }}">
        <ws:partial
            template="{{ _error.template }}"
            scope="{{ _error.options }}"
        />
    </ws:if>
    <ws:else>
        {{ content }}
    </ws:else>
</div>
 */
