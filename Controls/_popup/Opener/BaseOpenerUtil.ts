import {Control} from 'UI/Base';
import {parse as parserLib, load} from 'Core/library';
import * as isEmpty from 'Core/helpers/Object/isEmpty';
import ManagerController from 'Controls/_popup/Manager/ManagerController';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
import {goUpByControlTree} from 'UI/Focus';
import {IndicatorOpener} from 'Controls/LoadingIndicator';
import rk = require('i18n!Controls');

interface IModuleInfo {
    parsedModule: {
        path: string[]
    };
    isDefined: boolean;
    moduleClass: Control;
}

let ManagerWrapperCreatingPromise; // TODO: Compatible
let isLayerCompatibleLoaded; // TODO: Compatible

export default {
    requireModule(module: string|Control): Promise<Control> {
        const moduleClass = this.getModule(module);
        if (moduleClass) {
            return Promise.resolve(moduleClass);
        }
        return load(module);
    },

    // _prepareModuleName(module: string): IModuleInfo {
    //     const parsedModule = parserLib(module);
    //     const isDefined = require.defined(parsedModule.name);
    //     const moduleClass = isDefined && require(parsedModule.name);
    //     return {
    //         parsedModule,
    //         isDefined,
    //         moduleClass
    //     };
    // },

    getModule(module: string|Control): Control|null {
        if (typeof module === 'string') {
            const parsedModule = parserLib(module);
            const isDefined = require.defined(parsedModule.name);
            let moduleClass = isDefined && require(parsedModule.name);
            // Если кто-то позвал загрузку модуля, но она еще не отстрелила, require может вернуть пустой объект
            if (!isDefined || isEmpty(moduleClass)) {
                return null;
            }
            if (parsedModule.path.length) {
                parsedModule.path.forEach((property) => {
                    if (moduleClass && typeof moduleClass === 'object' && property in moduleClass) {
                        moduleClass = moduleClass[property];
                    }
                });
            }

            // It's not a library notation so mind the default export for ES6 modules
            if (moduleClass && moduleClass.__esModule && moduleClass.default) {
                moduleClass = moduleClass.default;
            }
            return moduleClass;
        }
        return module;
    },

    loadCompatibleLayer(callback: Function): void {
        const layerCompatibleModuleName: string = 'Lib/Control/LayerCompatible/LayerCompatible';
        const loadedCallback = () => {
            isLayerCompatibleLoaded = true;
            callback();
        };
        if (!isLayerCompatibleLoaded) {
            if (requirejs.defined(layerCompatibleModuleName)) {
                const Layer = requirejs(layerCompatibleModuleName);
                Layer.load().addCallback(loadedCallback);
            } else {
                requirejs([layerCompatibleModuleName], (Layer) => {
                    Layer.load().addCallback(loadedCallback);
                });
            }
        } else {
            loadedCallback();
        }
    },

    getManagerWithCallback(callback: Function): void {
        if (ManagerController.getManager()) {
            callback();
        } else {
            this.getManager().then(callback);
        }
    },

    showIndicator(cfg): void {
        const hideFunction = () => {
            IndicatorOpener.hide(id);
        };
        const indicatorConfig = this.getIndicatorConfig(null, cfg);
        const id: string = IndicatorOpener.show(indicatorConfig);
        cfg._events = {
            onOpen: hideFunction,
            onClose: hideFunction
        };
    },

    getIndicatorConfig(id: string, cfg = {}) {
        const findParentPopupId = () => {
            const parentControls: Control[] = goUpByControlTree(cfg.opener?._container);
            for (let i = 0; i < parentControls.length; i++) {
                if (parentControls[i]._moduleName === 'Controls/_popup/Manager/Popup') {
                    return parentControls[i]._options.id;
                }
            }
            return false;
        };
        const popupId = findParentPopupId();
        const config = {
            id,
            message: rk('Загрузка'),
            delay: 2000
        };
        if (popupId) {
            config.popupId = popupId;
        }
        return config;
    },

    // TODO Compatible
    getManager(): Promise<void> {
        if (!ManagerWrapperCreatingPromise) {
            if (!isNewEnvironment()) {
                const managerContainer = document.createElement('div');
                managerContainer.classList.add('controls-PopupContainer');
                document.body.insertBefore(managerContainer, document.body.firstChild);

                ManagerWrapperCreatingPromise = new Promise((resolve, reject) => {
                    require(['Core/Creator', 'Controls/compatiblePopup'], (Creator, compatiblePopup) => {
                        Creator(compatiblePopup.ManagerWrapper, {}, managerContainer).then(resolve);
                    }, reject);
                });
            } else {
                // Защита от случаев, когда позвали открытие окна до полного построения страницы
                if (ManagerController.getManager()) {
                    return Promise.resolve();
                } else {
                    ManagerWrapperCreatingPromise = new Promise((resolve) => {
                        const intervalDelay: number = 20;
                        const intervalId: number = setInterval(() => {
                            if (ManagerController.getManager()) {
                                clearInterval(intervalId);
                                resolve();
                            }
                        }, intervalDelay);
                    });
                }
            }
        }

        return ManagerWrapperCreatingPromise;
    }
};
