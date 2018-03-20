/// <amd-module name="File/Attach/Option/Getters/FS" />
define("File/Attach/Option/Getters/FS", ["require", "exports", "tslib", "File/Attach/Option/ResourceGetter", "File/ResourceGetter/FS"], function (require, exports, tslib_1, ResourceGetter, Getter) {
    "use strict";
    /**
     * Класс конфигурации IResourceGetter для выбора из файловой системы, передаваемый в Attach
     * @class
     * @name File/Attach/Option/Getters/FS
     * @extends File/Attach/Option/ResourceGetter
     * @public
     * @author Заляев А.В.
     */
    var FS = /** @class */ (function (_super) {
        tslib_1.__extends(FS, _super);
        /**
         * @cfg {Boolean} Выбрать несколько файлов
         * <wiTag group="Управление">
         * Позволяет выбрать несколько файлов
         * @name File/Attach/Option/Getters/FS#multiSelect
         */
        /**
         * @cfg {Array<String>} Список расширений выбираемых файлов
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
         * @name File/Attach/Option/Getters/FS#extensions
         */
        /**
         * @cfg {HTMLElement} DOM элемент - контейнер, в котором будет построен невидивый input[type=file]
         * посредством которого открывается окошко выбора файлов
         * <wiTag group="Управление">
         * По умолчанию: document.body
         * @name File/Attach/Option/Getters/FS#element
         */
        /**
         * @param {Object} [options] Параметры вызова конструктора
         * @constructor
         * @see File/IResourceGetter
         */
        function FS(options) {
            return _super.call(this, new Getter(options || {})) || this;
        }
        return FS;
    }(ResourceGetter));
    return FS;
});
