/// <amd-module name="File/Attach/Uploader" />
// dependency for types
import Model = require('WS.Data/Entity/Model');
import ISource = require("WS.Data/Source/ISource");
import SourceContainer = require("File/Attach/Container/Source");
import EventObject = require("Core/EventObject");
import IResource = require("File/IResource");
// real dependency
import Deferred = require("Core/Deferred");
import ParallelDeferred = require("Core/ParallelDeferred");

type CreateHandler = (data: any, file: IResource) => void;
type EventNames = "onLoaded" | "onProgress" | "onWarning" | "onLoadedFolder"
    | "onLoadResourceError" | "onLoadResource" | "onLoaded" | "onLoadError";
type CreateHandlers = {
    [propName in EventNames]?: CreateHandler;
}

/**
 * Класс для агрегации загрузки через нескольких источников данных
 * @class
 * @name File/Attach/Uploader
 * @author Заляев А.В.
 */
class Uploader {
    /**
     * @cfg {File/Attach/Container/Source} container
     */
    private _container: SourceContainer;
    /**
     * @cfg {Function} notify Обработчик событий источников данных
     */
    private _notify: (eventName: string, ...args) => void;
    /**
     * Список событий, необходимых к пробрасыванию от ISource
     * @type {Array.<String>}
     * @private
     */
    private _events: Array<string> = ["onProgress", "onWarning", "onLoadedFolder"];
    /**
     *
     * @param {File/Attach/Container/Source} container
     * @param {Function} notify
     * @constructor
     * @name File/Attach/Uploader
     */
    constructor(container: SourceContainer, notify) {
        if (!container || !(container instanceof SourceContainer)) {
            throw new Error("Invalid arguments");
        }
        this._container = container;
        this._notify = notify;
    }

    /**
     *
     * @param {Array.<File/IResource>} files Загружаемые файлы
     * @param {Object} [meta] Дополнительные мета-данные для отправки
     * @param {Object.<Function>} [handlers]
     * @return {Core/Deferred.<Array.<WS.Data/Entity/Model | Error>>}
     * @name File/Attach/Uploader#upload
     * @method
     */
    upload(files: Array<IResource>, meta?: {}, handlers?: CreateHandlers): Deferred<Array<Model | Error>> {
        let len = files.length;
        return new ParallelDeferred({
            steps: files.map((file: IResource) => {
                return () => {
                    return this._uploadFile(file, meta);
                }
            }),
            stopOnFirstError: false,
            maxRunningCount: 1 // Очередь загрузки
        }).done().getResult().addCallbacks((results) => {
            results.length = len;
            let array = Array.prototype.slice.call(results);

            this._notify("onLoaded", array);
            return array;
        }, (error) => {
            this._notify("onLoadError", error);
            return error;
        });
    }

    /**
     * загрузка одного файла через ISource полученный из SourceContainer
     * @param {File/IResource} file Загружаемый файл
     * @param {Object} [meta] Дополнительные мета-данные для отправки
     * @return {Core/Deferred.<WS.Data/Entity/Model | Error>}
     * @private
     * @name File/Attach/Uploader#_uploadFile
     * @method
     */
    private _uploadFile(file: IResource, meta?: {}): Deferred<Model | Error> {
        return this._container.get(file).addCallback((source: ISource) => {
            this._subscribeToSource(source);
            return source.create(meta || {}, file);
        }).addCallbacks((result: Model) => {
            this._notify("onLoadedResource", file, result);
            return result;
        }, (error: Error) => {
            this._notify("onLoadResourceError", file, error);
            return error;
        });
    }

    /**
     * Подписка на события ISource для их дальнейшего проброса
     * @param {WS.Data/Source/ISource} source
     * @private
     */
    private _subscribeToSource (source: ISource) {
        if (source.__attachSubscribed) {
            return;
        }
        this._events.forEach((eventName) => {
            source.subscribe(eventName, (event: EventObject, ...args) => {
                this._notify(eventName, ...args);
            })
        });
        source.__attachSubscribed = true;
    }
}

export = Uploader;
