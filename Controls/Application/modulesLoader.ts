/**
 * A modules loader on application level
 */
import {Library as library} from 'UI/Utils';

interface IParsedName {
    name: string;
    path: string[];
}

let cache: Record<string, Promise<unknown>> = {};

/**
 * requirejs.defined работает не корректно. Возвращает true, хотя callback в defined(name, callback) ещё не был вызван.
 */
const asyncLoadedModules: Record<string, boolean | void> = {};

function getFromLib<T, K>(lib: T, parsedName: IParsedName): K {
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

function requireSync<T>(name: string): T {
    return requirejs(name);
}

function requireAsync<T>(name: string): Promise<T> {
    return new Promise((resolve, reject) => {
        requirejs([name], resolve, reject);
    });
}

/**
 * Возвращает признак, что модуль загружен
 * @param name Имя модуля в обычном (Foo/bar) или библиотечном (Foo/bar:baz) синтаксисе
 */
export function isLoaded(name: string): boolean {
    /*
     Делаю проверку, что загруженный модуль имеет тип функции, т.к. может быть require уже реально загрузил.
     Текущее решение, нужно для случая, когда модуль реально возвращает пустой объект, и нужно вернуть ответ,
     что модуль загружен.
    */

     const parsedInfo: IParsedName = library.parse(name);
    if (asyncLoadedModules[parsedInfo.name]) {
        return true;
    }

    // Проверяем наличие, что бы не было сообщения в лог
    if (!requirejs.defined(parsedInfo.name)) {
        return false;
    }

    const module = requirejs(parsedInfo.name);
    if (typeof module !== 'undefined' && (module instanceof Function || Object.keys(module).length > 0)) {
        asyncLoadedModules[parsedInfo.name] = true;
        return true;
    }

    return false;
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

    let promiseResult = requireAsync(parsedInfo.name);
    cache[parsedInfo.name] = promiseResult = promiseResult.then((res) => {
        delete cache[parsedInfo.name];
        asyncLoadedModules[parsedInfo.name] = true;
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
    const module = requireSync(parsedInfo.name);
    return getFromLib(module, parsedInfo);

}

export function clearCache(): void {
    cache = {};
}
