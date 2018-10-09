/// <amd-module name="File/Decorator/isDestroyed" />
import Deferred = require('Core/Deferred');

type DecoratedFunction<TResult = void> = (...args: Array<any>) => TResult
type DecoratedAsyncFunction<TResult = void> = (...args: Array<any>) => Deferred<TResult>

let getMessage = (method: string) => `method "${method}" can not be used after destroy component`;

/**
 * Декоратор, проверяющий задестроен ли компонент
 * @name File/Decorator/isDestroyed#isDestroyed
 */
export let isDestroyed = (
    target,
    propertyKey,
    descriptor
) => {
    let origin = descriptor.value;
    descriptor.value = function (...args) {
        if (this.isDestroyed && this.isDestroyed()) {
            throw new Error(getMessage(propertyKey));
        }
        return origin.apply(this, arguments)
    };
    return descriptor;
};

/**
 * Декоратор асинхронной функции, проверяющий задестроен ли компонент
 * @name File/Decorator/isDestroyed#isDestroyedAsync
 */
export let isDestroyedAsync = (
    target,
    propertyKey,
    descriptor
) => {
    let origin = descriptor.value;
    descriptor.value = function (...args) {
        if (this.isDestroyed && this.isDestroyed()) {
            return Deferred.fail(getMessage(propertyKey));
        }
        return origin.apply(this, arguments)
    };
    return descriptor;
};
