/// <amd-module name="Controls/File/ResourceGetter/PhotoCam" />

import IResourceGetterBase = require("Controls/File/ResourceGetter/Base");
import Deferred = require("Core/Deferred");
import LocalFile = require("Controls/File/LocalFile");
import LocalFileLink = require("Controls/File/LocalFileLink");
import detection = require("Core/detection");
import merge = require("Core/core-merge");
import OpenDialog = require("SBIS3.CONTROLS/Action/OpenDialog");

const DIALOG = "Controls/File/ResourceGetter/PhotoCam/Dialog";
const DIALOG_PLUGIN = "Controls/File/ResourceGetter/PhotoCam/DialogPlugin";

type OpenDialogOptions = {
    mode: string;
    template: string;
    dialogOptions: any;
    componentOptions: any;
}
type Option = {
    /**
     * @name Controls/File/ResourceGetter/PhotoCam#openDialogOptions
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
 * @name Controls/File/ResourceGetter/PhotoCam
 * @extends Controls/File/ResourceGetter/Base
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
     * @return {Core/Deferred<Array<Controls/File/LocalFile | Controls/File/LocalFileLink>>}
     * @method
     * @name Controls/File/ResourceGetter/PhotoCam#getFiles
     * @see Controls/File/LocalFile
     * @see Controls/File/LocalFileLink
     */
    getFiles(): Deferred<Array<LocalFileLink | LocalFile>> {
        if (this.isDestroy()) {
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
     * @return {Core/Deferred<Boolean>}
     * @method
     * @name Controls/File/ResourceGetter/PhotoCam#canExec
     */
    canExec(): Deferred<boolean> {
        return Deferred.success(!this._chooseDef);
    }
}

export = PhotoCam;
