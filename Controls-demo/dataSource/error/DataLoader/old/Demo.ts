// @ts-ignore
import _template = require('wml!Controls-demo/dataSource/error/DataLoader/Demo');
// import { fetch } from 'Browser/Transport';
// @ts-ignore
// import * as ErrorController from 'Controls/Utils/ErrorController';
// @ts-ignore
import * as Control from 'Core/Control';
// @ts-ignore
// import { Parking } from 'SbisEnvUI/Maintains';
// @ts-ignore
import { Memory } from 'Types/source';
import 'css!Controls-demo/dataSource/error/DataLoader/Demo';
// import 'i18n!RmiTestClient/Error/DataLoader/Test';

export default class Demo extends Control {
    _template = _template;
    _children;
    _viewConfig;
    _forceUpdate;
    errorController;

    _ready = false;
    /* selectedSize = 501;
    sizes = new Memory({
        idProperty: 'id',
        data: [
            { title: 'large', id: 501},
            { title: 'medium', id: 275},
            { title: 'normal', id: 250},
            { title: 'small', id: 165}
        ]
    });

    selectedMode = 'include';
    mode = new Memory({
        idProperty: 'id',
        data: [
            { title: 'В области компонента', id: 'include' },
            { title: 'Диалоговое окно', id: 'dialog' },
            { title: 'На всю страницу', id: 'page' }
        ]
    });
    selectedCode = 403;
    code = new Memory({
        idProperty: 'id',
        data: [
            { id: 403, title: '403' },
            { id: 404, title: '404' },
            { id: 500, title: '500' },
            { id: 502, title: '502' },
            { id: 503, title: '503' },
            { id: 504, title: '504' }
        ]
    }); */
    proverbs = new Memory({
        idProperty: 'id',
        data: [
            { id: 1, title: 'Abiens abi!', description: 'Уходя, уходи!' },
            { id: 2, title: 'Alea jacta est', description: 'Жребий брошен.' },
            { id: 3, title: 'Acta est fabŭla.', description: 'Представление окончено.' },
            { id: 4, title: 'Aurea mediocrĭtas', description: 'Золотая середина (Гораций).' },
            { id: 5, title: 'A mari usque ad mare', description: 'От моря до моря. Девиз на гербе Канады.' }
        ]
    });
    _beforeMount() {
        if (typeof window !== 'undefined') {
            this._ready = true;
        }
    }
    _afterMount() {
        /* this.errorController = new ErrorController({});
        Object.keys(Parking.handlers).forEach((handlerName) => {
            this.errorController.addHandler(Parking.handlers[handlerName]);
        }); */
    }
    /* throwError() {
        const error = new fetch.Errors.HTTP({
            httpError: this.selectedCode,
            url: 'some/url',
            message: 'some error message',
            details: 'some details'
        });
        const mode = this.selectedMode;
        // Object.defineProperty(error, 'statusCode', { value: this.selectedCode });
        this.errorController.process({ error, mode }).then(this._showError.bind(this));
    }
    clearError() {
        this._viewConfig = undefined;
        this._forceUpdate();
    }
    _showError(config) {
        this._viewConfig = config;
        this._forceUpdate();
    }
    changeSize() {
        this.clearError();
    } */
}
