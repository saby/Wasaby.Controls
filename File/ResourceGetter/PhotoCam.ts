/// <amd-module name="File/ResourceGetter/PhotoCam" />

import IResourceGetterBase = require("File/ResourceGetter/Base");
import Deferred = require("Core/Deferred");
import LocalFile = require("File/LocalFile");
import LocalFileLink = require("File/LocalFileLink");
import detection = require("Core/detection");
import merge = require("Core/core-merge");
import OpenDialog = require("SBIS3.CONTROLS/Action/OpenDialog");
import {isDestroyedAsync} from 'File/Decorator/isDestroyed';

const DIALOG = "File/ResourceGetter/PhotoCam/Dialog";
const DIALOG_PLUGIN = "File/ResourceGetter/PhotoCam/DialogPlugin";

type OpenDialogOptions = {
    mode: string;
    template: string;
    dialogOptions: any;
    componentOptions: any;
}
type Option = {
    /**
     * @name File/ResourceGetter/PhotoCam#openDialogOptions
     * @cfg {Object} dialogOptions Объект параметров, пробрасываемый в OpenDialog.
     * @see SBIS3.CONTROLS/Action/OpenDialog
     */
    openDialog: Partial<OpenDialogOptions>;
}
const DEFAULT: Option = {
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
        template: detection.isIE10 || detection.isIE11? // В IE нет поддержки userMedia в Edge всё норм
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
class PhotoCam extends IResourceGetterBase {
    protected name = "PhotoCam";
    protected _$options : Option;
    private _openDialog;
    private _chooseDef: Deferred;
    constructor (opt: Partial<Option>) {
        super();
        this._$options = merge(merge({}, DEFAULT), opt || {});

        this._openDialog = new OpenDialog(this._$options.openDialog);
    }
    /**
     * Осуществляет получение изображения с веб-камеры устройства
     * @return {Core/Deferred.<Array.<File/LocalFile | File/LocalFileLink>>}
     * @method
     * @name File/ResourceGetter/PhotoCam#getFiles
     * @see File/LocalFile
     * @see File/LocalFileLink
     */
    @isDestroyedAsync
    getFiles(): Deferred<Array<LocalFileLink | LocalFile>> {
        if (this.isDestroyed()) {
            return Deferred.fail("Resource getter is destroyed");
        }
        this._chooseDef = new Deferred().addBoth((result) => {
            this._chooseDef = null;
            return result;
        });
        this._openDialog.execute({
            componentOptions: {
                resultDeferred: this._chooseDef
            }
        }).addErrback((err) => {
            this._chooseDef.errback(err);
        });
        return this._chooseDef;
    };
    /**
     * Возможен ли выбор файлов
     * @return {Core/Deferred.<Boolean>}
     * @method
     * @name File/ResourceGetter/PhotoCam#canExec
     */
    canExec(): Deferred<boolean> {
        return Deferred.success(!this._chooseDef);
    }
}

export = PhotoCam;
