/// <amd-module name="Controls/_dataSource/Controller" />
// TODO Базовый компонент для работы с ISource
/*
import {
    Controller as ErrorController
 } from 'Controls/_dataSource/error';
import {
    Controller as ParkingController
 } from 'Controls/_dataSource/parking';
import * as template from 'wml!Controls/_dataSource/Controller';

type Options = {
    errorController: ErrorController;
    source: ISource;
}

abstract class DataSourceController extends Control {
    protected _template = template;
    private __errorController: ErrorController;
    private __parkingController: ParkingController;
    protected _error: {
        template;
        options;
        erro
    };
    protected _parking: {

    };

    constructor(options: Partial<Options> = {}) {
        super(options);
        this.__errorController = options.errorController || new ErrorController({});
        this.__parkingController = options.parkingController || new ParkingController({});
    }
    abstract create(): Promise<Model>;
    abstract read(): Promise<Model>;
    abstract update(): Promise<Model>;
    abstract delete(): Promise<Model>;


    private __onresolve() {
    }
    private __onreject(error) {
        var errorTemplate = this.__errorController.process({
            error: error,
            mode: ErrorMode.include
        });
        if (!errorTemplate) {
            return;
        }
        return this._showError(errorTemplate);
    }
    private __finally() {
        this.__hideIndicator();
    }

    private __showError(config) {
        if (config.mode != ErrorMode.dialog) {
            // отрисовка внутри компонента
            this.__error = config;
            this._forceUpdate();
            return;
        }

        // диалоговое с ошибкой
        this._children.dialogOpener.open({
            template: config.template,
            templateOptions: config.options
        });
    }

    private __hideError() {
        if (this.__error) {
            this.__error = null;
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

    private __beforeCall() {
        this.__hideError();
        this.__showIndicator();
    }
}

*/
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
