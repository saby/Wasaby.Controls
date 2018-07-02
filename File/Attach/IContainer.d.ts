/// <amd-module name="File/Attach/Container/IContainer" />
import Deferred = require("Core/Deferred");
import {Source} from "File/Attach/Source";
import {IResourceConstructor} from "File/IResource";
import {IResourceGetter} from "File/IResourceGetter";

export interface IContainer <T> {
    push(element: T, ...args): void;
    get(...args): Deferred<T>
    has(...args): boolean;
    destroy(): void;
}

export interface IContainerLazy<T, Key = string> extends IContainer<T>{
    register(type: Key, link: string, options?: object);
}

export interface ISourceContainer extends IContainer<Source>{
    getRegisteredResource(): Array<IResourceConstructor>
}
export interface ISourceContainerLazy<Key = IResourceConstructor> extends
    IContainerLazy<Source, Key>,
    ISourceContainer
{}

export interface IGetterContainer extends IContainer<IResourceGetter> {}
export interface IGetterContainerLazy extends
    IGetterContainer,
    IContainerLazy<IResourceGetter, string>
{}
