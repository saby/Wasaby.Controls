/// <amd-module name="File/Attach/Option/Getters/FileSystem" />
define("File/Attach/Option/Getters/FileSystem", ["require", "exports", "tslib", "File/Attach/Option/ResourceGetter", "File/ResourceGetter/FileSystem"], function (require, exports, tslib_1, ResourceGetter, Getter) {
    "use strict";
    var GETTER_TYPE = "FileSystem";
    /**
     * Класс конфигурации IResourceGetter для выбора из файловой системы, передаваемый в Attach
     * @class
     * @name File/Attach/Option/Getters/FileSystem
     * @extends File/Attach/Option/ResourceGetter
     * @public
     * @author Заляев А.В.
     */
    var FileSystem = /** @class */ (function (_super) {
        tslib_1.__extends(FileSystem, _super);
        /**
         * @cfg {Boolean} Выбрать несколько файлов
         * <wiTag group="Управление">
         * Позволяет выбрать несколько файлов
         * @name File/Attach/Option/Getters/FileSystem#multiSelect
         */
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
         * @name File/Attach/Option/Getters/FileSystem#extensions
         */
        /**
         * @cfg {HTMLElement} DOM элемент - контейнер, в котором будет построен невидивый input[type=file]
         * посредством которого открывается окошко выбора файлов
         * <wiTag group="Управление">
         * По умолчанию: document.body
         * @name File/Attach/Option/Getters/FileSystem#element
         */
        /**
         * @param {Object} [options] Параметры вызова конструктора
         * @constructor
         * @see File/IResourceGetter
         */
        function FileSystem(options) {
            return _super.call(this, new Getter(options || {})) || this;
        }
        /**
         * @description
         * Тип геттера передается в метод choose File/Attach, чтобы указать каким способом(геттером) выбираются файлы
         * <pre>
         *   attach.choose(FileSystem.getType()); // выбрать файлы, используя системное окно
         * </pre>
         * @static
         * @method
         * @returns {String} Тип Getter'a
         */
        FileSystem.getType = function () {
            return GETTER_TYPE;
        };
        return FileSystem;
    }(ResourceGetter));
    return FileSystem;
});
