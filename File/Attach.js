define("File/Attach", ["require", "exports", "tslib", "File/Attach/Option/Getter", "File/Attach/Abstract", "File/Attach/Container/GetterLazy", "File/Attach/Container/SourceLazy"], function (require, exports, tslib_1, GetterOption, Abstract, GetterContainerLazy, SourceContainerLazy) {
    "use strict";
    var DEFAULT = {
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
         * @cfg {Array.<File/Attach/Option/GetterOption | File/Attach/Option/GetterOptionGetterLazyOption>}
         * Набор параметров для регестрации
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
    var Attach = /** @class */ (function (_super) {
        tslib_1.__extends(Attach, _super);
        function Attach(opt) {
            var _this = _super.call(this, tslib_1.__assign({}, DEFAULT, opt)) || this;
            _this._getterContainer = new GetterContainerLazy();
            _this._sourceContainer = new SourceContainerLazy();
            opt.getterOptions.forEach(function (option) {
                _this.addGetterOption(option);
            });
            opt.sourceOptions.forEach(function (option) {
                _this.addSourceOption(option);
            });
            return _this;
        }
        Attach.prototype.addGetterOption = function (option) {
            if (option instanceof GetterOption) {
                return this._getterContainer.push(option.getGetter());
            }
            return this._getterContainer.register(option.getType(), option.getLink(), option.getOptions());
        };
        Attach.prototype.addSourceOption = function (option) {
            this._sourceContainer.register(option.getResourceType(), option.getSourceName(), option.getOptions());
        };
        return Attach;
    }(Abstract));
    return Attach;
});
