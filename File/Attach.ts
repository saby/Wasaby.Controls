/// <amd-module name="File/Attach" />
// dependency for types
import SourceOption = require("File/Attach/Option/Source");
import GetterOption = require("File/Attach/Option/ResourceGetter");
import ResourceGetterOption = require("File/Attach/Option/ResourceGetter");
import {IResourceGetter} from "File/IResourceGetter";
import {IContainerLazy, ISourceContainerLazy} from "File/Attach/IContainer";
import Abstract = require("File/Attach/Abstract");
import GetterContainerLazy = require("File/Attach/Container/GetterLazy");
import SourceContainerLazy = require("File/Attach/Container/SourceLazy");

type Options = {
    sourceOptions: Array<SourceOption>;
    getterOptions: Array<ResourceGetterOption>;
    multiSelect: boolean;
    [propName: string]: any;
}
const DEFAULT: Partial<Options> = {
    /**
     * @cfg {Array<File/Attach/Option/Source>} Набор параметров для регестрации ISource
     * @example
     * Загрузка на бизнеслогику
     * <pre>
     *   var attach = new Attach({
     *       // фабрика опций для ISource: {@link SbisFile/Attach/Option/Sources/Fabric}
     *       sourceOptions: Fabric.getBLSourceOptions({
     *          endpoint: {
     *              contract: "simple"
     *          },
     *          binding: {
     *              create: "ЗагрузитьВНикуда"
     *          },
     *          fileProperty: "File"
     *       }),
     *       ...
     *   });
     * </pre>
     * Загрузка в СБИС Диск
     * <pre>
     *   var attach = new Attach({
     *       // фабрика опций для ISource: {@link SbisFile/Attach/Option/Sources/Fabric}
     *       sourceOptions: Fabric.getSbisDiskSourceOptions({
     *          catalog: 'mydocs'
     *       }),
     *       ...
     *   });
     * </pre>
     * @see File/Attach/Option/Source
     */
    sourceOptions: [],
    /**
     * @cfg {Array.<File/Attach/Option/ResourceGetter>} Набор параметров для регестрации
     * {@link File/IResourceGetter}, указывающий доступные способы получения ресурслв
     * @example
     * <pre>
     *   var attach = new Attach({
     *       getterOptions: [
     *          // Для нативного окна выбора файлов
     *          new FileSystem({
     *              multiSelect: true,
     *              extensions: ["image"]
     *           }), // модуль опций: File/Attach/Option/Getters/FileSystem
     *          // Для выбора чрезе FileLoader/Chooser
     *          new FileChooser({
     *              multiSelect: true,
     *              extensions: ["image"]
     *          }), // модуль опций: SbisFile/Attach/Option/Getters/FileChooser
     *          // Для получения файлов, путём Drag&drop
     *          new DropArea({
     *              extensions: ["image"],
     *              ondrop: function(fileData) {
     *                  log(fileData)
     *              },
     *              element: document.querySelector('#toDrop')
     *          }), // модуль опций: File/Attach/Option/Getters/DropArea
     *          // Для работы со сканерами
     *          new Scanner(), // модуль опций: SbisFile/Attach/Option/Getters/Scanner
     *          // Для получения фото с веб-камеры
     *          new PhotoCam(), // модуль опций: File/Attach/Option/Getters/PhotoCam
     *          // Для получения ресурсов из буфера обмена
     *          new Clipboard(), // модуль опций: SbisFile/Attach/Option/Getters/Clipboard
     *          // Для выбора файлов через окно СБИС Плагин'a
     *          new Dialogs() // модуль опций: SbisFile/Attach/Option/Getters/Dialogs
     *      ],
     *      ...
     *   });
     * </pre>
     * @see File/Attach/Option/ResourceGetter
     * @see File/IResourceGetter
     */
    getterOptions: []
};

/**
 * Класс, реализующий выбор и загрузку файлов через разные источники данных
 * <pre>
 *   var sourceOptions = {
 *      endpoint: {
 *          contract: "simple"
 *      },
 *      binding: {
 *          create: "ЗагрузитьВНикуда"
 *      },
 *      fileProperty: "Файл"
 *   }
 *   var attach = new Attach({
 *       // Возможные способы загрузки
 *       sourceOptions: [ // загрузка на бизнеслогику
 *          // для загрузки через ajax
 *          new BL(sourceOptions), // модуль опций: SbisFile/Attach/Option/Sources/BL
 *          // для загрузки через СБИС Плагин
 *          new BLPlugin(sourceOptions) // модуль опций: SbisFile/Attach/Option/Sources/BLPlugin
 *       ],
 *       //  Или фабрика опций для ISource: SbisFile/Attach/Option/Sources/Fabric
 *       // sourceOptions: Fabric.getBLSourceOptions(sourceOptions),
 *
 *       // Возможные способы получения ресурсов
 *       getterOptions: [
 *          // Для нативного окна выбора файлов
 *          new FileSystem({
 *              multiSelect: true,
 *              extensions: ["image"]
 *           }), // модуль опций: File/Attach/Option/Getters/FileSystem
 *          // Для выбора чрезе FileLoader/Chooser
 *          new FileChooser({
 *              multiSelect: true,
 *              extensions: ["image"]
 *          }), // модуль опций: SbisFile/Attach/Option/Getters/FileChooser
 *          // Для получения файлов, путём Drag&drop
 *          new DropArea({
 *              extensions: ["image"],
 *              ondrop: function(fileData) {
 *                  log(fileData)
 *              },
 *              element: document.querySelector('#toDrop')
 *          }), // модуль опций: File/Attach/Option/Getters/DropArea
 *          // Для работы со сканерами
 *          new Scanner(), // модуль опций: SbisFile/Attach/Option/Getters/Scanner
 *          // Для получения фото с веб-камеры
 *          new PhotoCam(), // модуль опций: File/Attach/Option/Getters/PhotoCam
 *          // Для получения ресурсов из буфера обмена
 *          new Clipboard(), // модуль опций: SbisFile/Attach/Option/Getters/Clipboard
 *          // Для выбора файлов через окно СБИС Плагин'a
 *          new Dialogs() // модуль опций: SbisFile/Attach/Option/Getters/Dialogs
 *      ],
 *      multiSelect: true
 *   });
 *
 *   self.getChildControlByName("fsBtn").subscribe("onActivated", function(){
 *      attach.choose(FileSystem.getType());
 *   });
 *   self.getChildControlByName("clipboardBtn").subscribe("onActivated", function(){
 *      attach.choose(Clipboard.getType());
 *   });
 *   self.getChildControlByName("scanBtn").subscribe("onActivated", function(){
 *      attach.choose(Scanner.getType());
 *   });
 *   self.getChildControlByName("uploadBtn").subscribe("onActivated", function(){
 *      attach.upload({
 *          // Дополнительные мета-данные для отправки
 *          // Сигнатура зависит от конечного сервиса загрузки
 *      });
 *   });
 * </pre>
 * @public
 * @class
 * @name File/Attach
 * @extends Core/Abstract
 * @author Заляев А.В.
 */
class Attach extends Abstract {
    protected _getterContainer: IContainerLazy<IResourceGetter>;
    protected _sourceContainer: ISourceContainerLazy;
    constructor(opt: Options) {
        super({
            ...DEFAULT,
            ...opt
        });
        this._getterContainer = new GetterContainerLazy();
        this._sourceContainer = new SourceContainerLazy();

        opt.getterOptions.forEach((option: GetterOption) => {
            this.addGetterOption(option);
        });
        opt.sourceOptions.forEach((option: SourceOption) => {
            this.addSourceOption(option)
        });
    }
    addGetterOption(option: GetterOption) {
        let getter = option.getGetter();
        if (typeof getter === "string") {
            return this._getterContainer.register(
                option.getName(),
                getter,
                option.getOptions()
            );
        }
        this._getterContainer.push(getter);
    }
    addSourceOption(option: SourceOption) {
        this._sourceContainer.register(
            option.getResourceType(),
            option.getSourceName(),
            option.getOptions()
        )
    }
}

export = Attach;
