/// <amd-module name="Controls/File/Attach/Option/Getters/DropArea" />
define("Controls/File/Attach/Option/Getters/DropArea", ["require", "exports", "tslib", "Controls/File/Attach/Option/ResourceGetter", "Controls/File/ResourceGetter/DropArea"], function (require, exports, tslib_1, ResourceGetter, DropAreaGetter) {
    "use strict";
    /**
     * Класс конфигурации IResourceGetter для выбора путём Drag&Drop, передаваемый в Attach
     * @class
     * @name Controls/File/Attach/Option/Getters/DropArea
     * @extends Controls/File/Attach/Option/ResourceGetter
     * @public
     * @author Заляев А.В.
     */
    var DropArea = /** @class */ (function (_super) {
        tslib_1.__extends(DropArea, _super);
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
         * @name Controls/File/Attach/Option/Getters/DropArea#extensions
         */
        /**
         * @cfg {HTMLElement} DOM элемент для перетаскивания файлов
         * @name Controls/File/Attach/Option/Getters/DropArea#element
         */
        /**
         * @cfg {Function} Обработчик события onDrop элемента. Позволяет получать ресурсы не ожидая вызова метода getFiles
         * @name Controls/File/Attach/Option/Getters/DropArea#ondrop
         */
        /**
         * @cfg {String} Текст на внутреннем элементе во время перемещения файлов
         * @name Controls/File/Attach/Option/Getters/DropArea#dragText
         */
        /**
         * @cfg {String} Текст на внутреннем элементе во время перемещения файлов непосредственно над ним
         * @name Controls/File/Attach/Option/Getters/DropArea#dropText
         */
        /**
         * @cfg {String} Класс внутреннего элемента обёртки, содержащий текст
         * @name Controls/File/Attach/Option/Getters/DropArea#innerClass
         */
        /**
         * @param {Object} [options] Параметры вызова конструктора
         * @constructor
         * @see Controls/File/IResourceGetter
         */
        function DropArea(options) {
            return _super.call(this, new DropAreaGetter(options || {})) || this;
        }
        return DropArea;
    }(ResourceGetter));
    return DropArea;
});
