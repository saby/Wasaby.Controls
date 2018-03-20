/// <amd-module name="File/ResourceGetter/PhotoCam/DialogAbstract" />

/// <amd-dependency path="SBIS3.CONTROLS/Button" />
/// <amd-dependency path="css!File/ResourceGetter/PhotoCam/Dialog" />

import CompoundControl = require("SBIS3.CONTROLS/CompoundControl");
import Deferred = require("Core/Deferred");
import LocalFile = require("File/LocalFile");
import LocalFileLink = require("File/LocalFileLink");
import tmpl = require("tmpl!File/ResourceGetter/PhotoCam/Dialog");
import WaitIndicator = require("SBIS3.CONTROLS/WaitIndicator");
import {IFileData} from "File/IFileData";

const BEFORE_SHOW_DELAY = 300;

let DialogAbstract = CompoundControl.extend({
    _dotTplFn: tmpl,
    $protected: {
        _options: {
            /**
             * @cfg {Core/Deferred} resultDeferred Результирующий Deferred
             */
            resultDeferred: null
        }
    },
    init() {
        DialogAbstract.superclass.init.call(this);
        let def = this._options.resultDeferred;
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
        setTimeout(() => {
            // Если через заданный период модуль задестроен, значит запрещён доступ к камере
            if (!this.isDestroyed()) {
                let parent = this.getParent();
                parent && parent.show();
            }
        }, BEFORE_SHOW_DELAY);

        let loadButton = this.getChildControlByName('loadButton');
        let photoButton = this.getChildControlByName('photoButton');
        this._localVideo = this.getContainer().find('.PhotoCamDialog_video')[0];

        this.getParent().subscribe("onAfterClose", () =>{
            if (def && !def.isReady()){
                def.cancel();
            }
            this._destroyMedia();
        });
        // save image
        loadButton.subscribe("onActivated", (event) => {
            this._getFiles().addBoth((res) => {
                def.callback(res);
                this.sendCommand("close");
            });
        });
        // play/pause
        photoButton.subscribe('onActivated', () => {
            if (this._localVideo.paused) {
                photoButton.setIcon('sprite:icon-24 icon-Photo icon-primary');
                loadButton.setEnabled(false);
                this._localVideo.play();
            } else {
                photoButton.setIcon('sprite:icon-24 icon-WebCamera icon-primary');
                loadButton.setEnabled(true);
                this._localVideo.pause();
            }
        });
        this._localVideo.onloadedmetadata = (event) => {
            this._localVideo.play();
        };
        let initDef = this._initUserMedia().addCallbacks(() => {
            photoButton.setEnabled(true);
            this.getContainer().find(".PhotoCamDialog__container").removeClass("ws-hidden");
        }, (error) => {
            def.callback(error);
            this.sendCommand("close");
        });
        WaitIndicator.make({
            target: this,
            message: rk("Инициализация камеры"),
            delay: 0
        }, initDef);
    },
    /**
     *
     * @return {Core/Deferred<Array<Blob>>}
     * @private
     */
    _getFiles(): Deferred<Array<Blob>> {
        return this._getImage().addCallback((blob: Blob | string) => {
            if(!blob) {
                return new Deferred.cancel();
            }
            return [this._prepareFile(blob)];
        });
    },
    /**
     * Возвращает {@link File/IFileData} по переданному параметру
     * @param {File | Blob | string} image
     * @return {File/LocalFile | File/LocalFileLink}
     * @private
     */
    _prepareFile(image: File | Blob | string): IFileData {
        if (image instanceof Blob) {
            let name = "imageFromCamera.png";

            // для корректной загрузки Blob необходимо имя файла
            image.name = name;
            image.lastModifiedDate = new Date();

            return new LocalFile(image, {}, name);
        }
        return new LocalFileLink(image);
    },

    /**
     * Метод инициации медиа контента
     * @return {Core/Deferred}
     * @protected
     */
    _initUserMedia(): Deferred {
        throw new Error("abstract method");
    },
    /**
     *  Завершение работы с медиа контентом
     * @protected
     * @abstract
     */
    _destroyMedia() {
        throw new Error("abstract method");
    },
    /**
     * Получение текущего изображения из медиа контента
     * @return {Core/Deferred<Blob | File | String>}
     * @protected
     * @abstract
     */
    _getImage(): Deferred<Blob | File | string> {
        throw new Error("abstract method");
    }
});

DialogAbstract.ERRORS = {
    permissionDenied: rk('К сожалению, вы запретили доступ к устройствам мультимедиа, что не позволяет вам использовать веб-камеру.'),
    NO_CAMERA: rk('К сожалению, к вашему компьютеру не подключена камера.'),
    NO_MEDIA: rk('Не удалось получить доступ к устройствам мультимедиа.')
};

export = DialogAbstract;
