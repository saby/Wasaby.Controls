/// <amd-module name="File/Attach/Base" />
// dependency for types
import {Source as ISource} from 'File/Attach/Source';
import {IResourceGetter} from 'File/IResourceGetter';
import {IResourceConstructor} from 'File/IResource';
import Abstract = require("File/Attach/Abstract");
import GetterContainer = require("File/Attach/Container/Getter");
import SourceContainer = require("File/Attach/Container/Source");
import {isDestroyed} from "File/Decorator/isDestroyed";

/**
 * Класс, реализующий выбор и загрузку файлов через разные источники данных
 * <br/>
 * Выбор и загрузка ресурсов:
 * <pre>
 *   var attach = new Base({
 *      multiSelect: false
 *   });
 *
 *   var scanner = new ScannerGetter();
 *   var fs = new FileSystem();
 *   attach.registerGetter(scanner);
 *   attach.registerGetter(fs);
 *
 *   var sourceOption = {
 *      endpoint: {
 *          contract: "simple"
 *      },
 *      binding: {
 *          create: "ЗагрузитьВНикуда"
 *      },
 *      idProperty: "link"
 *   };
 *   attach.registerSource(new BL_SbisPluginSource(sourceOption));
 *   attach.registerSource(new SbisFileSource(sourceOption));
 *
 *   self.getChildControlByName("fsBtn").subscribe("onActivated", function(){
 *      attach.choose(fs.getType());
 *   });
 *   self.getChildControlByName("scanBtn").subscribe("onActivated", function(){
 *      attach.choose(scanner.getType());
 *   });
 *   self.getChildControlByName("uploadBtn").subscribe("onActivated", function(){
 *      attach.upload({
 *          // Дополнительные мета-данные для отправки
 *      }).addCallback(function(results){
 *          // вывод результатов загрузки
 *      });
 *   });
 * </pre>
 * @public
 * @class
 * @name File/Attach/Base
 * @extends File/Attach/Abstract
 * @author Заляев А.В.
 */
class Base extends Abstract {
    constructor(opt) {
        super(opt);
        this._getterContainer = new GetterContainer();
        this._sourceContainer = new SourceContainer();
    }

    /**
     * Регестрация IResourceGetter, для получения файлов
     * @param {File/IResourceGetter} ResourceGetter
     * @example
     * Регестрация сканера:
     * <pre>
     *    require([
     *    'File/Attach/Base'
     *    'SBIS3.Plugin/File/Extensions/Integration/FileGetter/ScannerGetter'
     *    ], function (Base, ScannerGetter) {
     *       var attach = new Base();
     *       var getter = new ScannerGetter();
     *       attach.registerGetter(getter);
     *       // теперь доступно прикрепление сканов
     *       attach.choose(getter.getType()).addCallback(function(links){ // links: Array<File/LocalFileLink>
     *          ...
     *       });
     *    });
     * </pre>
     * @method
     * @name File/Attach/Base#registerGetter
     * @see File/ResourceGetter/Base
     */
    @isDestroyed
    registerGetter(ResourceGetter: IResourceGetter): void {
        this._getterContainer.push(ResourceGetter);
    }
    /**
     * Регистрация источников данных для загрузки определённого типа файла
     * @param {Function} type конструктор обёртки над файлом
     * @param {File/Attach/Source} source источник данных
     * @example
     * Регестрация источника, умеющего загружать LocalFileLink:
     * <pre>
     *    require([
     *      'File/Attach/Base',
     *      'SBIS3.Plugin/File/Extensions/Integration/Source/BL_SbisPluginSource'
     *    ], function (Base, BL_SbisPluginSource) {
     *       var attach = new Base();
     *       attach.registerSource(new BL_SbisPluginSource({
     *          endpoint: {
     *              contract: "simple"
     *          },
     *          binding: {
     *              create: "ЗагрузитьВНикуда"
     *          },
     *          idProperty: "link"
     *       }));
     *       ...
     *    });
     * </pre>
     * @method
     * @name File/Attach/Base#registerSource
     * @see File/LocalFile
     * @see File/LocalFileLink
     * @see File/HttpFileLink
     * @see File/Attach/Source
     */
    @isDestroyed
    registerSource(type: IResourceConstructor, source: ISource): void {
        return this._sourceContainer.push(source, type);
    }
}

export = Base;
