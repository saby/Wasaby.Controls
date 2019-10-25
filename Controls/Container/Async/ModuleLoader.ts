import libHelper = require("Core/library");
import {IoC} from "Env/Env";

let cache = {};

class ModuleLoader {
    private getFromLib(lib: any, parsedName: any): any {
        let mod = lib;
        let processed = [];
        parsedName.path.forEach(function (property) {
            processed.push(property);
            if (mod && typeof mod === 'object' && property in mod) {
                mod = mod[property];
            } else {
                IoC.resolve("ILogger").error("Async module loading error",
                    'Cannot find module "' + processed.join('.')
                    + '" in library "' + parsedName.name + '".');
            }
        });
        return mod;
    };

    public loadAsync(name: string): any {
        let parsedInfo = libHelper.parse(name);
        let promiseResult;
        if (this.isCached(parsedInfo.name)) {
            if(this.isLoaded(parsedInfo.name)) {
                return new Promise((resolve) => {
                    let cachedLib = cache[parsedInfo.name];
                    let loadedModule = this.getFromLib(cachedLib, parsedInfo)
                    resolve(loadedModule);
                });
            } else {
                promiseResult = cache[parsedInfo.name];
            }
        } else {
            promiseResult = this.requireAsync(parsedInfo.name);
            this.cacheModule(parsedInfo.name, promiseResult);
        }
        promiseResult = promiseResult.then((res) => {
            let module = this.getFromLib(res, parsedInfo);
            this.cacheModule(parsedInfo.name, res);
            return module;
        }, (e) => {
            this.cacheModule(parsedInfo.name, {});
            let errorMessage = "Couldn't load module " + parsedInfo.name;
            IoC.resolve("ILogger").error(errorMessage, e);
            throw new Error(errorMessage);
        });
        return promiseResult;
    };

    public loadSync(name: string): any {
        let parsedInfo = libHelper.parse(name);
        let loaded;
        if (this.isCached(parsedInfo.name)) {
            loaded = cache[parsedInfo.name];
        } else {
            try {
                loaded = this.requireSync(parsedInfo.name);
                this.cacheModule(parsedInfo.name, loaded);
            } catch(e) {
                IoC.resolve("ILogger").error("Couldn't load module " + parsedInfo.name, e);
                return null;
            }
        }
        return this.getFromLib(loaded, parsedInfo);
    };

    private cacheModule(name, module) {
        cache[name] = module;
    };

    private isLoaded(name) {
        let parsedInfo = libHelper.parse(name);
        let cacheValue = cache[parsedInfo.name];
        if(cacheValue && !(cacheValue instanceof Promise)) {
            return true;
        }
        return false;
    };

    private isCached(name) {
        return !!cache[name];
    }

    private requireSync(name): any {
        return require(name);
    };

    private requireAsync(name): any {
        return new Promise((resolve, reject) => {
            require([name], resolve, reject);
        });
    };

    public clearCache(): void {
        cache = {};
    }

}

export = ModuleLoader;