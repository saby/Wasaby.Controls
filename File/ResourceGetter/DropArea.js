/// <amd-module name="File/ResourceGetter/DropArea" />
define("File/ResourceGetter/DropArea", ["require", "exports", "tslib", "File/ResourceGetter/Base", "Core/Deferred", "File/utils/ExtensionsHelper", "File/utils/filter", "File/ResourceGetter/DropArea/replaceDir", "File/ResourceGetter/DropArea/Overlay", "File/Decorator/isDestroyed"], function (require, exports, tslib_1, IResourceGetterBase, Deferred, ExtensionsHelper, filter, replaceDir, Overlay_1, isDestroyed_1) {
    "use strict";
    var OPTION = {
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
        ondrop: function (files) { }
        /**
         * @cfg {String} Текст подсказки во время перемещения файлов
         * @name File/ResourceGetter/DropArea#dragText
         */
        /**
         * @cfg {String} Текст подсказки во время перемещения файлов непосредственно над областью
         * @name File/ResourceGetter/DropArea#dropText
         */
        /**
         * @cfg {String} Текст дополнительной подсказки во время перемещения файлов
         * @name File/ResourceGetter/DropArea#dragSubtitle
         */
        /**
         * @cfg {String} Текст дополнительной подсказки во время перемещения файлов непосредственно над областью
         * @name File/ResourceGetter/DropArea#dropSubtitle
         */
        /**
         * @cfg {String} Дополнительный класс элемента обёртки
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
    var DropArea = /** @class */ (function (_super) {
        tslib_1.__extends(DropArea, _super);
        function DropArea(cfg) {
            var _this = _super.call(this) || this;
            _this.name = "DropArea";
            // При построении на СП/ПП нетсмысла от модуля
            if (typeof document === 'undefined') {
                return _this;
            }
            _this._options = Object.assign({}, OPTION, cfg);
            _this._extensions = new ExtensionsHelper(_this._options.extensions);
            _this._overlay = new Overlay_1.Overlay(tslib_1.__assign({}, _this._options, { ondrop: function (data) {
                    replaceDir(data).addCallback(function (results) {
                        return filter(results, {
                            extensions: _this._extensions,
                            maxSize: _this._options.maxSize
                        });
                    }).addCallback(function (results) {
                        if (_this._options.ondrop) {
                            _this._options.ondrop.call(_this, results);
                        }
                        if (_this._selectDef) {
                            _this._selectDef.callback(results);
                            _this._selectDef = null;
                        }
                    });
                } }));
            return _this;
        }
        /**
         * Возвращает Deferred, который стрельнёт, когда на указанный элемент будут перемещены файлы
         * @return {Core/Deferred.<Array.<File/LocalFile | Error>>}
         * @method
         * @name File/ResourceGetter/DropArea#getFiles
         * @see File/LocalFile
         */
        DropArea.prototype.getFiles = function () {
            if (this._selectDef) {
                this._selectDef.cancel();
            }
            return this._selectDef = new Deferred();
        };
        /**
         * Возможен ли выбор файлов
         * @return {Core/Deferred.<Boolean>}
         * @method
         * @name File/ResourceGetter/DropArea#canExec
         */
        DropArea.prototype.canExec = function () {
            return Deferred.success(!this.isDestroyed());
        };
        DropArea.prototype.destroy = function () {
            if (this._selectDef) {
                this._selectDef.cancel();
            }
            this._overlay.destroy();
            _super.prototype.destroy.call(this);
        };
        tslib_1.__decorate([
            isDestroyed_1.isDestroyedAsync
        ], DropArea.prototype, "getFiles", null);
        return DropArea;
    }(IResourceGetterBase));
    return DropArea;
});
