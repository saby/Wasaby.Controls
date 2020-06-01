import {Control} from 'UI/Base';
import {parse as parserLib, load} from 'Core/library';
import * as isEmpty from 'Core/helpers/Object/isEmpty';
import ManagerController from 'Controls/_popup/Manager/ManagerController';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';

interface IModuleInfo {
    parsedModule: {
        path: string[]
    };
    isDefined: boolean;
    moduleClass: Control;
}

let ManagerWrapperCreatingPromise; // TODO: Compatible

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

    getManagerWithCallback(callback: Function): void {
        if (ManagerController.getManager()) {
            callback();
        } else {
            this.getManager().then(callback);
        }
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
