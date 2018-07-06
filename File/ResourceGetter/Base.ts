/// <amd-module name="File/ResourceGetter/Base" />
import Deferred = require("Core/Deferred");
import {IResourceGetter} from 'File/IResourceGetter';
import {IResource} from "File/IResource";

/**
 * Абстрактный класс, реализующий интерфейс получения файлов IResourceGetter
 * <br/>
 * Получение скана:
 * <pre>
 *    require(['SBIS3.Plugin/File/Extensions/Integration/FileGetter/ScannerGetter'], function (ScannerGetter) {
 *       var getter = new ScannerGetter();
 *       getter.getFiles().addCallbacks(function(links){ // links: Array<File/LocalFileLink | Error>
 *          // действия с отсканированным документом
 *       }, function(err) {
 *          log(err);
 *          alert("Сканирование не доступно");
 *       });
 *    });
 * </pre>
 * @public
 * @class
 * @name File/ResourceGetter/Base
 * @implements File/IResourceGetter
 * @author Заляев А.В.
 * @abstract
 */
/**
 * Осуществляет выбор ресурсов
 * @method
 * @name File/ResourceGetter/Base#getFiles
 * @abstract
 * @return {Core/Deferred.<Array.<File/IResource | Error>>}
 * @example
 * Получение скана:
 * <pre>
 *    require(['SBIS3.Plugin/File/Extensions/Integration/FileGetter/ScannerGetter'], function (ScannerGetter) {
 *       var getter = new ScannerGetter();
 *       getter.getFiles().addCallbacks(function(links){ // links: Array<File/LocalFileLink | Error>
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
 *    require(['File/ResourceGetter/FileSystem'], function (FileSystem) {
 *       var getter = new FileSystem({
 *          extensions: ["png", "jpg"]
 *       });
 *       getter.getFiles().addCallbacks(function(files){ // files: Array<File/LocalFile | Error>
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
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 */
/**
 * Возможен ли выбор ресурса
 * @abstract
 * @method
 * @name File/ResourceGetter/Base#canExec
 * @return {Core/Deferred.<Boolean>}
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

abstract class ResourceGetterBase implements IResourceGetter /** @lends File/ResourceGetter/Base.prototype*/{
    protected name: string;
    private _isDestroyed: boolean = false;
    abstract getFiles(): Deferred<Array<IResource | Error>>;
    abstract canExec(): Deferred<boolean>;
    destroy(): void {
        this._isDestroyed = true;
    }
    isDestroyed(): boolean {
        return this._isDestroyed;
    }
    /**
     * Возвращает строку - тип ресурса
     * @method
     * @name File/ResourceGetter/Base#getType
     * @return {String}
     */
    getType(): string {
        return this.name || "";
    }
}

export = ResourceGetterBase;
