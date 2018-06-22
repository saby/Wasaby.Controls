/// <amd-module name="File/ResourceGetter/DropArea" />

import IResourceGetterBase = require("File/ResourceGetter/Base");
import Deferred = require("Core/Deferred");
import LocalFile = require("File/LocalFile");
import ExtensionsHelper = require("File/utils/ExtensionsHelper");
import filter = require("File/utils/filter");
import replaceDir = require("File/ResourceGetter/DropArea/replaceDir");
import {Overlay, OverlayViewConfig} from 'File/ResourceGetter/DropArea/Overlay';

type DropAreaConfig = OverlayViewConfig & {
    element: HTMLElement;
    extensions?: Array<string>;
    maxSize?: number;
    ondrop?: (files: Array<LocalFile>) => void;
}
const OPTION: Partial<DropAreaConfig> = {
    /**
     * @cfg {Array.<String>} Список расширений выбираемых файлов
     * <wiTag group="Управление">
     * Помимо перечисления массива конкретных расширений файлов, можно также передать в массив значения:
     * <ul>
     *      <li> "image" - доступен выбор всех типов изображений</li>
     *      <li> "audio" - доступен выбор всех типов аудио файлов</li>
     *      <li> "video" - доступен выбор всех типов видео файлов</li>
     * </ul>
     * @example
     * <pre>
     *    extensions: ["image"]
     *    // extensions: ["jpe","jpg","jpeg","gif","png","bmp","ico","svg","svgz","tif","tiff","pct","psd"]
     * </pre>
     * @name File/ResourceGetter/DropArea#extensions
     */
    /**
     * @cfg {Number} Максимальный размер файла доступный для выбора (в МБ)
     * @name File/ResourceGetter/DropArea#maxSize
     */
    /**
     * @cfg {HTMLElement} DOM элемент для перетаскивания файлов
     * @name File/ResourceGetter/DropArea#element
     */
    /**
     * @cfg {Function} Обработчик события onDrop элемента. Позволяет получать ресурсы не ожидая вызова метода getFiles
     * @name File/ResourceGetter/DropArea#ondrop
     */
    ondrop: (files: Array<LocalFile>) => {}
    /**
     * @cfg {String} Текст на внутреннем элементе во время перемещения файлов
     * @name File/ResourceGetter/DropArea#dragText
     */
    /**
     * @cfg {String} Текст на внутреннем элементе во время перемещения файлов непосредственно над ним
     * @name File/ResourceGetter/DropArea#dropText
     */
    /**
     * @cfg {String} Класс внутреннего элемента обёртки, содержащий текст
     * @name File/ResourceGetter/DropArea#innerClass
     */
};

/**
 * Класс реализующий интерфейс IResourceGetter, позволяющий получать ресурсы через DragAndDrop
 * @class
 * @name File/ResourceGetter/DropArea
 * @extends File/IResourceGetter
 * @public
 * @author Заляев А.В.
 */
class DropArea extends IResourceGetterBase {
    protected readonly name = "DropArea";
    private readonly _extensions: ExtensionsHelper;
    private readonly _overlay: Overlay;
    protected _options;
    private _selectDef: Deferred<Array<LocalFile>>;
    constructor(cfg: DropAreaConfig) {
        super();
        // При построении на СП/ПП нетсмысла от модуля
        if (typeof document === 'undefined') {
            return this;
        }

        this._options = Object.assign({}, OPTION, cfg);
        this._extensions = new ExtensionsHelper(this._options.extensions);
        this._overlay = new Overlay({
            ...this._options,
            ondrop: (data: DataTransfer) => {
                replaceDir(data).addCallback((results) => {
                    return filter(results, {
                        extensions: this._extensions,
                        maxSize: this._options.maxSize
                    });
                }).addCallback((results) => {
                    if (this._options.ondrop) {
                        this._options.ondrop.call(this, results);
                    }
                    if (this._selectDef) {
                        this._selectDef.callback(results);
                        this._selectDef = null;
                    }
                });
            }
        });
    }
    /**
     * Возвращает Deferred, который стрельнёт, когда на указанный элемент будут перемещены файлы
     * @return {Core/Deferred.<Array.<File/LocalFile | Error>>}
     * @method
     * @name File/ResourceGetter/DropArea#getFiles
     * @see File/LocalFile
     */
    getFiles(): Deferred<Array<LocalFile | Error>> {
        if (this.isDestroyed()) {
            return Deferred.fail("Resource getter is destroyed");
        }
        if (this._selectDef) {
            this._selectDef.cancel();
        }
        return this._selectDef = new Deferred();
    }
    /**
     * Возможен ли выбор файлов
     * @return {Core/Deferred.<Boolean>}
     * @method
     * @name File/ResourceGetter/DropArea#canExec
     */
    canExec(): Deferred<boolean> {
        return Deferred.success(!this.isDestroyed());
    }
    destroy() {
        if (this._selectDef) {
            this._selectDef.cancel();
        }
        this._overlay.destroy();
        super.destroy();
    }
}

export = DropArea;
