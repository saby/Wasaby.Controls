/// <amd-module name="File/ResourceGetter/PhotoCam" />
define("File/ResourceGetter/PhotoCam", ["require", "exports", "tslib", "File/ResourceGetter/Base", "Core/Deferred", "Core/detection", "Core/core-merge", "SBIS3.CONTROLS/Action/OpenDialog", "File/Decorator/isDestroyed"], function (require, exports, tslib_1, IResourceGetterBase, Deferred, detection, merge, OpenDialog, isDestroyed_1) {
    "use strict";
    var DIALOG = "File/ResourceGetter/PhotoCam/Dialog";
    var DIALOG_PLUGIN = "File/ResourceGetter/PhotoCam/DialogPlugin";
    var DEFAULT = {
        openDialog: {
            mode: "dialog",
            dialogOptions: {
                autoHeight: true,
                resizeable: false,
                autoWidth: true,
                /**
                 * Проверить доступность камеры можно только попробовав к ней подключиться
                 * В случаях, если
                 * а) пльзователь уже запретил доступ к камере
                 * б) обращение к медиа-девайсам запрещено политиками безопасности
                 * в) камера отсуствует
                 * то получим эффект "моргания окошка" которое отрисовывает текст инициализации и тут же дестроится
                 *
                 * поэтому скрываем диалоговое окно по умолчанию
                 */
                visible: false
            },
            template: detection.isIE10 || detection.isIE11 ? // В IE нет поддержки userMedia в Edge всё норм
                DIALOG_PLUGIN :
                DIALOG
        }
    };
    /**
     * Класс, для получения фотографии с камеры, реализующий интерфейс IResourceGetter
     * @class
     * @name File/ResourceGetter/PhotoCam
     * @extends File/ResourceGetter/Base
     * @public
     * @author Заляев А.В.
     */
    var PhotoCam = /** @class */ (function (_super) {
        tslib_1.__extends(PhotoCam, _super);
        function PhotoCam(opt) {
            var _this = _super.call(this) || this;
            _this.name = "PhotoCam";
            _this._$options = merge(merge({}, DEFAULT), opt || {});
            _this._openDialog = new OpenDialog(_this._$options.openDialog);
            return _this;
        }
        /**
         * Осуществляет получение изображения с веб-камеры устройства
         * @return {Core/Deferred.<Array.<File/LocalFile | File/LocalFileLink>>}
         * @method
         * @name File/ResourceGetter/PhotoCam#getFiles
         * @see File/LocalFile
         * @see File/LocalFileLink
         */
        PhotoCam.prototype.getFiles = function () {
            var _this = this;
            if (this.isDestroyed()) {
                return Deferred.fail("Resource getter is destroyed");
            }
            this._chooseDef = new Deferred().addBoth(function (result) {
                _this._chooseDef = null;
                return result;
            });
            this._openDialog.execute({
                componentOptions: {
                    resultDeferred: this._chooseDef
                }
            }).addErrback(function (err) {
                _this._chooseDef.errback(err);
            });
            return this._chooseDef;
        };
        ;
        /**
         * Возможен ли выбор файлов
         * @return {Core/Deferred.<Boolean>}
         * @method
         * @name File/ResourceGetter/PhotoCam#canExec
         */
        PhotoCam.prototype.canExec = function () {
            return Deferred.success(!this._chooseDef);
        };
        tslib_1.__decorate([
            isDestroyed_1.isDestroyedAsync
        ], PhotoCam.prototype, "getFiles", null);
        return PhotoCam;
    }(IResourceGetterBase));
    return PhotoCam;
});
