define("File/Attach", ["require", "exports", "File/Attach/Lazy", "Core/core-simpleExtend", "Core/Abstract"], function (require, exports, Lazy, CoreExtend, Abstract) {
    "use strict";
    /**
     * Класс, реализующий выбор и загрузку файлов через разные источники данных, агрегирующий работу с Attach/Base
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
    var Attach = CoreExtend.extend(Abstract, {
        _$options: {
            /**
             * @cfg {Boolean} Множественный выбор.
             * <ul>
             * <li> true - результат выбора ресурсов .choose попаддёт во внутренее состояние для загрузки вместе
             * с результатом предыдущих выборок </li>
             * <li> false - внутренее состояние для загрузки будет содержать только результат последней выборки </li>
             * </ul>
             * @name File/Attach#multiSelect
             */
            multiSelect: true,
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
        },
        constructor: function (opt) {
            var _this = this;
            Attach.superclass.constructor.apply(this, arguments);
            this._$options = Object.assign({}, this._$options, opt);
            this._attacher = new Lazy({ multiSelect: this._$options.multiSelect });
            var events = [
                "onProgress", "onWarning", "onLoadedFolder", "onLoaded", "onChooseError", "onChosen",
                "onLoadError", "onLoadResourceError", "onLoadedResource", 'onBeforeLoad'
            ];
            this._publish.apply(this, events);
            // пробрасываем события загрузки файлов
            events.forEach(function (eventName) {
                _this._attacher.subscribe(eventName, function (event) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    event.setResult(_this._notify.apply(_this, [eventName].concat(args)));
                });
            });
            // регестрируем список IResourceGetter из наследников
            opt.getterOptions.forEach(function (getterOpt) {
                var getter = getterOpt.getGetter();
                if (typeof getter === "string") {
                    return _this._attacher.registerLazyGetter(getterOpt.getName(), getter, getterOpt.getOptions());
                }
                _this._attacher.registerGetter(getter);
            });
            opt.sourceOptions.forEach(function (srcOpt) {
                _this._attacher.registerLazySource(srcOpt.getResourceType(), srcOpt.getSourceName(), srcOpt.getOptions());
            });
        },
        /// region IDirectInsertFile
        /**
         * Устанавливает ресурсы в список выбранных
         * @param {Array.<File/IResource> | File/IResource} files файл или набор устанавливаемых файлов
         * @example
         * Привязка файлов, полученных путём Drag&Drop к Attach для последующей загрузки
         * <pre>
         *    myArea.subscribe("onDrop", function(event, data) {
         *      if (data.file instanceof Blob) {
         *          attach.setSelectedResource(new LocalFile(data.file))
         *      }
         *    });
         * </pre>
         * @method
         * @name File/Attach#setSelectedResource
         * @see File/LocalFile
         * @see File/LocalFileLink
         * @see File/HttpFileLink
         */
        setSelectedResource: function (files) {
            return this._attacher.setSelectedResource(files);
        },
        /**
         * Очищает набор выбраных ресурсов
         * @void
         * @method
         * @name File/Attach#clearSelectedResource
         */
        clearSelectedResource: function () {
            return this._attacher.clearSelectedResource();
        },
        /**
         * Возвращает набор выбраных ресурсов
         * @return {Array.<File/IResource>}
         * @method
         * @name File/Attach#getSelectedResource
         * @see File/LocalFile
         * @see File/LocalFileLink
         * @see File/HttpFileLink
         */
        getSelectedResource: function () {
            return this._attacher.getSelectedResource();
        },
        /// endregion
        /// region IUpload
        /**
         * Загрузка выбраных ресурсов.
         * При отсутствии ресурсов во внутреннем состоянии, возвращаеммый Deferred будет завершен ошибкой.
         * @param {*} [meta] Дополнительные мета-данные для отправки. Сигнатура зависит от конечного сервиса загрузки
         * @return {Core/Deferred.<Array.<File/Attach/Model | Error>>} Набор, содержащий модели с результатами,
         * либо ошибками загрузки
         * @example
         * Выбор и загрузка файла:
         * <pre>
         *   var attach = new Attach({...});
         *
         *   self.getChildControlByName("fsBtn").subscribe("onActivated", function(){});
         *      attach.choose("FileSystem").addCallback(function(files) {
         *          attach.upload({
         *              // Дополнительные мета-данные для отправки
         *              // Сигнатура зависит от конечного сервиса загрузки
         *              'ИдО': self.getContext().getValue('ИдО')
         *          }).addCallback(function(results){
         *              // вывод результатов загрузки
         *              var successUploads = results.filter(function(res) {
         *                  if (res instanceof Error) {
         *                      alert(res);
         *                      return false;
         *                  }
         *                  return true;
         *              });
         *              self.draw(successUploads);
         *          });;
         *      });
         *   }
         * </pre>
         * @method
         * @name File/Attach#upload
         * @see File/Attach/Model
         * @see File/Attach/Base#getSelectedResource
         */
        upload: function (meta) {
            return this._attacher.upload(meta);
        },
        /// endregion IUpload
        /**
         * Метод вызова выбора ресурсов
         * @param {String} getterName Имя модуля {@link File/IResourceGetter}
         * @return {Core/Deferred.<Array.<File/IResource>>}
         * @example
         * Выбор и загрузка файла:
         * <pre>
         *   var attach = new Attach({...});
         *
         *   self.getChildControlByName("fsBtn").subscribe("onActivated", function(){});
         *      attach.choose("FileSystem").addCallback(function(files) {
         *          attach.upload({
         *              // Дополнительные мета-данные для отправки
         *          }).addCallback(function(results){
         *              // вывод результатов загрузки
         *          });;
         *      });
         *   }
         * </pre>
         * @method
         * @name File/Attach#choose
         * @see File/IResourceGetter#getType
         * @see File/LocalFile
         * @see File/LocalFileLink
         * @see File/HttpFileLink
         */
        choose: function (getterName) {
            return this._attacher.choose(getterName);
        },
        /**
         * Возвращает список конструкторов над ресурсами, для которыйх зарегестрирован ISource
         * @return {Array.<Function>}
         * @see File/LocalFile
         * @see File/LocalFileLink
         * @see File/HttpFileLink
         */
        getRegisteredResource: function () {
            return this._attacher.getRegisteredResource();
        },
        destroy: function () {
            this._attacher.destroy();
            this._attacher = null;
            Attach.superclass.destroy.apply(this, arguments);
        }
    });
    return Attach;
});
/**
 * @event onProgress
 * @name File/Attach#onProgress
 * @param {Core/EventObject} eventObject Дескриптор события.
 * @param {Object} data
 * @param {File/IResource} file
 */
/**
 * @event onWarning
 * @name File/Attach#onWarning
 * @param {Core/EventObject} eventObject Дескриптор события.
 * @param {Object} data
 * @param {File/IResource} file
 */
/**
 * @event onLoadedFolder
 * @name File/Attach#onLoadedFolder
 * @param {Core/EventObject} eventObject Дескриптор события.
 * @param {Object} data
 * @param {File/IResource} file
 */
/**
 * @event onLoaded
 * Событые окончания загрузки ресурсов
 *
 * @name File/Attach#onLoaded
 * @param {Core/EventObject} eventObject Дескриптор события.
 * @param {Array.<Error | File/Attach/Model>} results Массив, содержащий результаты загрузки выбранных ресурсов.
 * Эквивалентно рузультату Deferred'а .upload
 */
/**
 * @event onLoadError
 * Событые ошибки начала загрузки.
 *
 * @name File/Attach#onLoadError
 * @param {Core/EventObject} eventObject Дескриптор события.
 * @param {Error} error
 */
/**
 * @event onLoadResourceError
 * Событые ошибки загрузки отдельного ресурса
 *
 * @name File/Attach#onLoadResourceError
 * @param {Core/EventObject} eventObject Дескриптор события.
 * @param {File/IResource} resource загружаемый ресурс
 * @param {Error} error
 *
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 */
/**
 * @event onLoadedResource
 * Событые загрузки отдельного ресурса
 *
 * @name File/Attach#onLoadedResource
 * @param {Core/EventObject} eventObject Дескриптор события.
 * @param {File/IResource} resource загружаемый ресурс
 * @param {File/Attach/Model} model Результат загрузки
 *
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 * @see File/Attach/Model
 */
/**
 * @event onChosen
 * Событые выбора ресурса
 * <wiTag group="Управление">
 * Обработка результата:
 * При передаче в результат события заначений, приводимых к логическому false, указанный ресурс не попадёт
 * в результат Deferred'a метода choose. При передаче любого другого значения текщуий ресурс будет заменён им
 *
 * @name File/Attach#onChosen
 * @param {Core/EventObject} eventObject Дескриптор события.
 * @param {File/IResource} resource загружаемый ресурс
 * @example
 * Фильтрация файлов по размеру
 * <pre>
 *    attach.subscribe('onChosen', function(event, fileData) {
 *       if (getSize(fileData) > 100 * MB) {
 *          event.setResult(new Error(rk('Превышен допустимый размер загружаемого файла')))
 *       }
 *    });
 * </pre>
 * Предобработка перед загрузкой
 * <pre>
 *    attach.subscribe('onChosen', function(event, fileData) {
 *       var blurImage = addFilter(fileData, "blur", 0.5);
 *       event.setResult(blurImage);
 *    });
 * </pre>
 *
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 */
/**
 * @event onChooseError
 * Событые ошибки выбора ресурса
 *
 * @name File/Attach#onChooseError
 * @param {Core/EventObject} eventObject Дескриптор события.
 * @param {Error} error объект ошибки
 * @example
 * <pre>
 *    attach.subscribe('onChooseError', function(event, error) {
 *        alert(error);
 *    });
 * </pre>
 */
/**
 * @event onBeforeLoad
 * Событые выбора ресурса
 * <wiTag group="Управление">
 * Обработка результата:
 * <ul>
 *     <li> false - отмена загрузки. При этом ресурсы, предназначенные для загрузки пропадут из внутреннего состояния
 *     и не попадут в вледующую загрузку </li>
 *     <li> object - объект дополнительных данных для запроса meta будет заменён на переданный результат </li>
 * </ul>
 *
 * @name File/Attach#onBeforeLoad
 * @param {Core/EventObject} eventObject Дескриптор события.
 * @param {Array.<File/IResource>} resource загружаемый ресурс
 * @param {Object} meta Дополнительные мета-данные для отправки.
 * @example
 * <pre>
 *    attach.subscribe('onBeforeLoad', function(event, files, meta) {
 *       if (isEmpty(meta)) {
 *          event.setResult(self.getUploadParam())
 *       }
 *    });
 * </pre>
 *
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 */
