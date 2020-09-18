/**
 * A modules loader on application level
 */
import ModulesManager from 'RequireJsLoader/ModulesManager';
import {Library as library} from 'UI/Utils';

interface IParsedName {
    name: string;
    path: string[];
}

let cache: Record<string, Promise<unknown>> = {};

let modulesManager: ModulesManager;

function getModulesManager(): ModulesManager {
    if (!modulesManager) {
        modulesManager = new ModulesManager(requirejs);
    }
    return modulesManager;
}

function getFromLib<T, K>(lib: T, parsedName: IParsedName): K {
    // return library.extract(lib, parsedName);

    let mod: unknown = lib;

    const processed = [];
    parsedName.path.forEach((property) => {
        processed.push(property);
        if (mod && typeof mod === 'object' && property in mod) {
            mod = mod[property];
        } else {
            throw new Error(`Cannot find module "${processed.join('.')}" in library "${parsedName.name}"`);
        }
    });

    return mod as K;
}

function isCached(name: string): boolean {
    return !!cache[name];
}

/**
 * Возвращает признак, что модуль загружен
 * @param name Имя модуля в обычном (Foo/bar) или библиотечном (Foo/bar:baz) синтаксисе
 */
export function isLoaded(name: string): boolean {
    const parsedInfo: IParsedName = library.parse(name);
    return getModulesManager().isLoaded(parsedInfo.name);
}

/**
 * Асинхронно загружает модуль
 * @param name Имя модуля в обычном (Foo/bar) или библиотечном (Foo/bar:baz) синтаксисе
 */
export function loadAsync<T>(name: string): Promise<T> {
    if (isLoaded(name)) {
        return new Promise((resolve) => {
            resolve(loadSync(name));
        });
    }

    const parsedInfo: IParsedName = library.parse(name);
    const loadFromModule = (res) => getFromLib(res, parsedInfo);

    if (isCached(parsedInfo.name)) {
        return cache[parsedInfo.name].then(loadFromModule) as Promise<T>;
    }

    let promiseResult = getModulesManager()
        .load<[T]>([parsedInfo.name])
        .then(([moduleBody]) => moduleBody);

    cache[parsedInfo.name] = promiseResult = promiseResult.then((res) => {
        delete cache[parsedInfo.name];
        return res;
    }, (error) => {
        delete cache[parsedInfo.name];
        throw error;
    });

    return promiseResult.then(loadFromModule) as Promise<T>;
}

/**
 * Возвращает загруженный модуль
 * @param name Имя модуля в обычном (Foo/bar) или библиотечном (Foo/bar:baz) синтаксисе
 */
export function loadSync<T>(name: string): T {
    const parsedInfo = library.parse(name);
    const module = getModulesManager().loadSync<T>(parsedInfo.name);
    return getFromLib(module, parsedInfo);

}

export function clearCache(): void {
    cache = {};
}
