/// <amd-module name="File/ResourceGetter/PhotoCam/DialogAbstract" />
define("File/ResourceGetter/PhotoCam/DialogAbstract", ["require", "exports", "SBIS3.CONTROLS/CompoundControl", "Core/Deferred", "File/LocalFile", "File/LocalFileLink", "tmpl!File/ResourceGetter/PhotoCam/Dialog", "SBIS3.CONTROLS/WaitIndicator", "SBIS3.CONTROLS/Button", "css!File/ResourceGetter/PhotoCam/Dialog"], function (require, exports, CompoundControl, Deferred, LocalFile, LocalFileLink, tmpl, WaitIndicator) {
    "use strict";
    var BEFORE_SHOW_DELAY = 300;
    var DialogAbstract = CompoundControl.extend({
        _dotTplFn: tmpl,
        $protected: {
            _options: {
                /**
                 * @cfg {Core/Deferred} resultDeferred Результирующий Deferred
                 */
                resultDeferred: null
            }
        },
        init: function () {
            var _this = this;
            DialogAbstract.superclass.init.call(this);
            var def = this._options.resultDeferred;
            if (!def) {
                throw new Error('Param "resultDeferred" is required');
            }
            if (!(def instanceof Deferred)) {
                throw new Error('Param "resultDeferred" is not a Deferred');
            }
            /**
             * Логику показа окна делаем через задержку, а не в обработке колбека получения камеры, т.к.
             * а) пользователь не успел разрешить/запретить доступ к камере
             * б) в ie ещё не успели подтянутся файлы для работы с мультимедиа через activeX
             *
             * В таких случаях показываем окошко, в котором будет крутиться индикатор, до получения результата
             */
            setTimeout(function () {
                // Если через заданный период модуль задестроен, значит запрещён доступ к камере
                if (!_this.isDestroyed()) {
                    var parent_1 = _this.getParent();
                    parent_1 && parent_1.show();
                }
            }, BEFORE_SHOW_DELAY);
            var loadButton = this.getChildControlByName('loadButton');
            var photoButton = this.getChildControlByName('photoButton');
            this._localVideo = this.getContainer().find('.PhotoCamDialog_video')[0];
            this.getParent().subscribe("onAfterClose", function () {
                if (def && !def.isReady()) {
                    def.cancel();
                }
                _this._destroyMedia();
            });
            // save image
            loadButton.subscribe("onActivated", function (event) {
                _this._getFiles().addBoth(function (res) {
                    def.callback(res);
                    _this.sendCommand("close");
                });
            });
            // play/pause
            photoButton.subscribe('onActivated', function () {
                if (_this._localVideo.paused) {
                    photoButton.setIcon('sprite:icon-24 icon-Photo icon-primary');
                    loadButton.setEnabled(false);
                    _this._localVideo.play();
                }
                else {
                    photoButton.setIcon('sprite:icon-24 icon-WebCamera icon-primary');
                    loadButton.setEnabled(true);
                    _this._localVideo.pause();
                }
            });
            this._localVideo.onloadedmetadata = function (event) {
                _this._localVideo.play();
            };
            var initDef = this._initUserMedia().addCallbacks(function () {
                photoButton.setEnabled(true);
                _this.getContainer().find(".PhotoCamDialog__container").removeClass("ws-hidden");
            }, function (error) {
                def.callback(error);
                _this.sendCommand("close");
            });
            WaitIndicator.make({
                target: this,
                message: rk("Инициализация камеры"),
                delay: 0
            }, initDef);
        },
        /**
         *
         * @return {Core/Deferred.<Array.<Blob>>}
         * @private
         */
        _getFiles: function () {
            var _this = this;
            return this._getImage().addCallback(function (blob) {
                if (!blob) {
                    return new Deferred.cancel();
                }
                return [_this._prepareFile(blob)];
            });
        },
        /**
         * Возвращает {@link File/IResource} по переданному параметру
         * @param {File | Blob | string} image
         * @return {File/LocalFile | File/LocalFileLink}
         * @private
         */
        _prepareFile: function (image) {
            if (image instanceof Blob) {
                var name_1 = "imageFromCamera.png";
                // для корректной загрузки Blob необходимо имя файла
                image.name = name_1;
                image.lastModifiedDate = new Date();
                return new LocalFile(image, {}, name_1);
            }
            return new LocalFileLink(image);
        },
        /**
         * Метод инициации медиа контента
         * @return {Core/Deferred}
         * @protected
         */
        _initUserMedia: function () {
            throw new Error("abstract method");
        },
        /**
         *  Завершение работы с медиа контентом
         * @protected
         * @abstract
         */
        _destroyMedia: function () {
            throw new Error("abstract method");
        },
        /**
         * Получение текущего изображения из медиа контента
         * @return {Core/Deferred.<Blob | File | String>}
         * @protected
         * @abstract
         */
        _getImage: function () {
            throw new Error("abstract method");
        }
    });
    DialogAbstract.ERRORS = {
        permissionDenied: rk('К сожалению, вы запретили доступ к устройствам мультимедиа, что не позволяет вам использовать веб-камеру.'),
        NO_CAMERA: rk('К сожалению, к вашему компьютеру не подключена камера.'),
        NO_MEDIA: rk('Не удалось получить доступ к устройствам мультимедиа.')
    };
    return DialogAbstract;
});
