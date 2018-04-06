/// <amd-module name="File/Attach/Container/IContainer" />
import Deferred = require("Core/Deferred");
declare interface IContainer <T> {
    push(element: T, ...args): void;
    get(...args): Deferred<T>
    has(...args): boolean;
    destroy(): void;
}
export = IContainer;
