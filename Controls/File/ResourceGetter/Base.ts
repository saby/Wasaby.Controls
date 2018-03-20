/// <amd-module name="Controls/File/ResourceGetter/Base" />
import Deferred = require("Core/Deferred");
import {IResourceGetter} from "Controls/File/IResourceGetter";

/**
 * Абстрактный класс, реализующий интерфейс получения файлов IResourceGetter
 * <br/>
 * Получение скана:
 * <pre>
 *    require(['SBIS3.Plugin/File/Extensions/Integration/FileGetter/ScannerGetter'], function (ScannerGetter) {
 *       var getter = new ScannerGetter();
 *       getter.getFiles().addCallbacks(function(links){ // links: Array<Controls/File/LocalFileLink | Error>
 *          // действия с отсканированным документом
 *       }, function(err) {
 *          log(err);
 *          alert("Сканирование не доступно");
 *       });
 *    });
 * </pre>
 * @public
 * @class
 * @name Controls/File/ResourceGetter/Base
 * @implements IResourceGetter
 * @author Заляев А.В.
 * @abstract
 */
/**
 * Осуществляет выбор ресурсов
 * @method
 * @name Controls/File/ResourceGetter/Base#getFiles
 * @abstract
 * @return {Core/Deferred<Array<Controls/File/IFileData | Error>>}
 * @example
 * Получение скана:
 * <pre>
 *    require(['SBIS3.Plugin/File/Extensions/Integration/FileGetter/ScannerGetter'], function (ScannerGetter) {
 *       var getter = new ScannerGetter();
 *       getter.getFiles().addCallbacks(function(links){ // links: Array<Controls/File/LocalFileLink | Error>
 *          ...
 *       }, function(err) {
 *          // Ошибка недоступности ResourceGetter
 *          log(err);
 *          alert("Сканирование не доступно");
 *       });
 *    });
 * </pre>
 * Выбор из файловой системы:
 * <pre>
 *    require(['Controls/File/ResourceGetter/FS'], function (FSGetter) {
 *       var getter = new FSGetter({
 *          extensions: ["png", "jpg"]
 *       });
 *       getter.getFiles().addCallbacks(function(files){ // files: Array<Controls/File/LocalFile | Error>
 *          files.forEach(function(f){
 *              if (f instanceOf Error) {
 *                  // Ошибка выбора файла (прим: выбран файл неверного расширения)
 *                  alert("Ошибка выбора файла: " + f.message);
 *              }
 *          });
 *       }, function(err) {
 *          // Ошибка недоступности ResourceGetter
 *          log(err);
 *          alert("Выбор файлов не доступен");
 *       });
 *    });
 * </pre>
 * @see Controls/File/LocalFile
 * @see Controls/File/LocalFileLink
 * @see Controls/File/HttpFileLink
 */
/**
 * Возможен ли выбор ресурса
 * @abstract
 * @method
 * @name Controls/File/ResourceGetter/Base#canExec
 * @return {Core/Deferred<boolean>}
 * @example
 * Доступны ли сканеры:
 * <pre>
 *    require(['SBIS3.Plugin/File/Extensions/Integration/FileGetter/ScannerGetter'], function (ScannerGetter) {
 *       var getter = new ScannerGetter();
 *       getter.canExec().addCallback(function(isCan){
 *          if (!isCan) {
 *              alert("Сканирование не доступно")
 *          }
 *       });
 *    });
 * </pre>
 */

abstract class IResourceGetterBase implements IResourceGetter /** @lends Controls/File/ResourceGetter/Base.prototype*/{
    protected name: string;
    private _isDestroyed: boolean = false;
    abstract getFiles(): Deferred<Array<IFileData | Error>>;
    abstract canExec(): Deferred<boolean>;
    destroy(): void {
        this._isDestroyed = true;
    }
    isDestroy(): boolean {
        return this._isDestroyed;
    }
    /**
     * Возвращает строку - тип ресурса
     * @method
     * @name Controls/File/ResourceGetter/Base#getType
     * @return {String}
     */
    getType(): string {
        return this.name || "";
    }
}

export = IResourceGetterBase;
