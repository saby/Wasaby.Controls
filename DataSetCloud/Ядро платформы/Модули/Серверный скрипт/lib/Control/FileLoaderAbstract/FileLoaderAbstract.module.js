/**
 * Модуль 'Компонент общий класс загрузки файла'.
 * @description
 */
define('js!SBIS3.CORE.FileLoaderAbstract', [
   'js!SBIS3.CORE.Control',
   'js!SBIS3.CORE.PluginManager',
   'js!SBIS3.CORE.LoadingIndicator'
], function(Control, PluginManager) {

   'use strict';

   /**
    * @class $ws.proto.FileLoaderAbstract
    * @extends $ws.proto.Control
    * @designTime plugin /design/DesignPlugin
    */
   $ws.proto.FileLoaderAbstract = Control.Control.extend(/** @lends $ws.proto.FileLoaderAbstract.prototype */{
      /**
       * @event onLoadStarted Событие, происходящее перед началом загрузки файла
       * <wiTag group="Загрузка">
       * Происходит перед началом загрузки файла. Позволяет изменять параметры фильтрации
       * — Обработка результата:
       * False – отмена загрузки файла.
       * $ws.proto.Deferred - дожидаемся результата выполнения асинхронной операции
       * @param {Object} eventObject Дескриптор события описание в классе $ws.proto.Abstract
       * @example
       * <pre>
       *    loadFile.subscribe('onLoadStarted', function(event){
       *       if( this.getFileName() === 'sbis.exe' ){
       *          event.setResult( true );
       *          this.setUploadParams({'ИдО': 12});
       *       } else
       *          event.setResult( false ); // Отменим загрузку файла
       *    });
       * </pre>
       */
      /**
       * @event onLoaded Событие, происходящее после загрузки файла
       * <wiTag group="Загрузка">
       * Происходит после загрузки файла. Позволяет обработать результат загрузки файла
       * — Обработка результата:
       * Результат не обрабатывается
       * @param {Object} eventObject Дескриптор события описание в классе $ws.proto.Abstract
       * @param {Object} response Ответ бизнес-логики
       * @param {Boolean} isFinished Сигнализирует о том, что загруженый файл был последний
       * @example
       * <pre>
       *    loadFile.subscribe('onLoaded', function(event, response, isFinished){
       *       if( isFinished && response.result > 0 )
       *          this.getTopParent().close();
       *    });
       * </pre>
       */
      /**
       * @event onAppletReady Событие, происходящее после запуска плагина
       * <wiTag group="Управление">
       * Происходит после запуска плагина. Позволяет выполнить какие-нибудь действия с плагином
       * — Обработка результата:
       * Результат не обрабатывается
       * @param {Object} eventObject Дескриптор события описание в классе $ws.proto.Abstract
       * @param {String} id Идентификатор контрола
       * @param {Object} plugin Сам плагин
       * @param {Object} error Ошибка загрузки плагина
       * @example
       * <pre>
       *    loadFile.subscribe('onAppletReady', function(event, id, plugin, error){
       *       if( plugin ){
       *          var params = plugin.getParams();
       *          $('id').innerHtml = generateParams( params );
       *       } else
       *          alert( error.message );
       *    });
       * </pre>
       */
      /**
       * @event onProgressState Событие, происходящее при загрузке файла, возвращает процент загрузки
       * <wiTag group="Загрузка">
       * Происходит при загрузке файла, возвращает процент загрузки.
       * — Обработка результата:
       * Результат не обрабатывается
       * @param {Object} eventObject Дескриптор события описание в классе $ws.proto.Abstract
       * @param {String} percent Процент загрузки
       * @example
       * <pre>
       *    loadFile.subscribe('onProgressState', function(event, percent){
       *       indicator.setPercent(percent);
       *    });
       * </pre>
       */
      /**
       * @event onChange Событие, происходящее после выбора файла, возвращает путь до файла
       * <wiTag group="Загрузка">
       * Происходит после выбора файла, возвращает путь до файла
       * — Обработка результата:
       * Результат не обрабатывается
       * @param {Object} eventObject Дескриптор события описание в классе $ws.proto.Abstract
       * @param {String} fileName Путь до файла
       * @param {Object} file Информация о файле (размер, дата изменения, тип)
       * @example
       * <pre>
       *    loadFile.subscribe('onChange', function(event, fileName){
       *       record.set('ИмяФайла', fileName);
       *    });
       * </pre>
       */

      /**
       * @event onReady
       * <wiTag noShow>
       */
      /**
       * @event onDestroy
       * <wiTag noShow>
       */
      /**
       * @event onFocusIn
       * <wiTag noShow>
       */
      /**
       * @event onFocusOut
       * <wiTag noShow>
       */
      /**
       * @event onKeyPressed
       * <wiTag noShow>
       */
      /**
       * @event onClick
       * <wiTag noShow>
       */
      /**
       * @event onSizeChanged
       * <wiTag noShow>
       */
      /**
       * @event onStateChanged
       * <wiTag noShow>
       */
      /**
       * @event onTooltipContentRequest
       * <wiTag noShow>
       */

      $protected : {
         _options : {
            /**
             * @cfg {String[]} Названия параметров метода
             * <wiTag group="Данные">
             * Массив названий параметров метода
             * <pre>
             *    ['ИдО', 'Дополнительный параметр', 'Ид']
             * </pre>
             */
            filterParams : [],
            /**
             * @cfg {Object.<string, boolean|number|string>} Название полей из контекста
             * <wiTag group="Данные">
             * Объект с названиями полей из контекста, которые должны попасть в параметры
             * <pre>
             *    {
             *       'ИдО': 123,
             *       'Дополнительный параметр' : '123'
             *    }
             * </pre>
             */
            paramsMapping : {},
            /**
             * @cfg {Object} Фиксированные параметры метода
             * <wiTag group="Данные">
             * Объект со значениями параметров метода, которые надо взять из контекста
             * <pre>
             *    {
             *       'Ид': 'UUID файла'
             *    }
             * </pre>
             */
            queryFilter : {},
            /**
             * @cfg {String} Метод загрузки файла на бизнес-логике
             * <wiTag group="Данные">
             * Метод загрузки файла на бизнес-логике
             * <pre>
             *    method: 'Документ.ПрикрепитьФайл'
             * </pre>
             * @editor MethodBLChooser
             */
            method : '',
            /**
             * @cfg {String} Адрес сервиса загрузки данных
             * <wiTag group="Управление">
             * Адрес сервиса на который будет загружаться файл
             * <pre>
             *    otherUrl: 'https://wi.sbis.ru/service/sbis-rpc-service300.dll'
             * </pre>
             */
            otherUrl: '',
            /**
             * @cfg {Boolean} Показывать индикатор при загрузке файла
             * Если true, то при загрузке файла будет показан индикатор загрузки
             * <wiTag group="Отображение">
             */
            showIndicator: true
         },
         _eventBusChannelPlugins: null,
         _plugin: {},
         _randomId: '',
         _targetUrl: '',
         _loading: false
      },

      $constructor: function(){
         this._publish('onLoadStarted', 'onLoaded', 'onAppletReady');

         var url = this._options.otherUrl ? this._options.otherUrl : $ws._const.defaultServiceUrl;

         var host= [window.location.protocol,window.location.hostname].join('//');
         if (window.location.port && window.location.protocol == 'http:') {
            host += ':' + window.location.port;
         }

         url = /^https?:/.test(url) ? url : host + url;

         this._targetUrl = url;
         this._randomId = $ws.helpers.randomId();
      },

      _log: function(message, className) {
         $ws.single.ioc.resolve('ILogger').log(className || 'FileLoaderAbstract', message);
      },

      _logError: function(error, className) {
         $ws.single.ioc.resolve('ILogger').error(className || 'FileLoaderAbstract', error.message || error);
      },

      /**
       * Возвращает имя последнего выбранного файла
       * @private
       */
      _notFormatedVal: function() {
         return this._curval;
      },

      /**
       * Показывает индикатор загрузки файла
       * @protected
       */
      _showIndicator: function() {
         $ws.single.Indicator.setMessage('Загрузка...');
      },

      /**
       * Скрывает индикатор загрузки файла
       * @protected
       */
      _hideIndicator: function() {
         $ws.single.Indicator.hide();
      },

      /**
       * Возвращает объект с параметрами загрузки файла
       * @returns {Object}
       * @protected
       */
      _getRequestParameters: function() {
         var requestParams = {
            idControl: this._randomId,          //Controller unique id which is tried to upload file to the server
            fileName : '',                      //The user selected file name (it is full path to file on client machine)
            targetURL : this._targetUrl,        //The service URL where need to send file
            method :  this._options.method,     // The name of Business Logic method which is handle the file
            XSBISSessionID : $.cookie('sid'),   // get XSbisCookie for file upload auth
            postName : 'file1',                 // the field name in HTTP multipart request
            requestParams : {                   // additional params for request
               //ИдО: ''
               //some other parameters
            },
            fileParams: {                       // additional params for file
               //Ид:'9ec02050-4660-ce8c-910e-9ee97a9f69a0'
               //some other parameters
            }
         };

         var params = this._prepareParams();
         $ws.helpers.forEach(params, function(param, i) {
            if (param instanceof $ws.proto.Record) {
               param = param.toObject(true);
            }
            var serializedVal = $ws.proto.ReaderSBIS.serializeParameter(i, param).d;
            if (i == 'Ид' || i == 'ИмяФайла' || i == 'Размер') {
               requestParams.fileParams[i] = serializedVal;
            } else {
               requestParams.requestParams[i] = serializedVal;
            }
         });

         return requestParams;
      },

      /**
       * Подготавливает объект с параметрами запроса
       * @returns {Object}
       * @protected
       */
      _prepareParams: function(){
         var params = $ws.core.merge({}, this._options.queryFilter),
             filter = this._options.filterParams;
         for (var i = 0, l = filter.length; i < l; i++) {
            if (!(filter[i] in params)) {
               params[filter[i]] = this.getLinkedContext().getValue(
                  filter[i] in this._options.paramsMapping ? this._options.paramsMapping[filter[i]] : filter[i]
               );
            }
         }
         return params;
      },

      _parseResponse: function(resp) {
         var json;
         if (resp instanceof Error) {
            json = {error: {code: '500', message: resp.message}};
         } else {
            try {
               json = JSON.parse(resp);
            } catch (e) {
               // Попытаемся еще раз, в 3.7.1 Плагин станет возвращать нормальную ошибку, и это можно будет убрать
               try {
                  resp = resp
                     .replace('System.Net.WebException: ', '')
                     .replace(/\n[\s\S]*"/g, '"')
                     .replace(/\n/g, '')
                     .replace(/\r/g, '');
                  json = JSON.parse(resp);
               } catch(e) {}
            }
            if (!json) {
               json = {error: {code: '500', message: 'Внутренняя ошибка сервера!'}};
            } else if (json.error && !json.error.code) {
               json.error.code = '500';
            }
         }

         return json;
      },

      /**
       * После загрузки файла на сервер
       * @param {String|Object} resp Ответ бизнес-логики
       */
      _postFinished: function(resp) {
         var self = this;
         if (this._loading) {
            if (Object.prototype.toString.call(resp) == '[object Object]') {
               $ws.helpers.forEach(resp, function(json, index) {
                  resp[index] = self._parseResponse(json);
               });
               if (Object.keys(resp).length == 1) {
                  resp = resp[Object.keys(resp)[0]];
               }
            } else {
               resp = self._parseResponse(resp);
            }

            this._notify('onLoaded', resp, true);
            if (this._options.showIndicator) {
               this._hideIndicator();
            }
            this._loading = false;
         }
      },

      /**
       * Отсылает файлы с помощью xhr
       * @param {Array|Object} files
       * @protected
       */
      _xhrPost: function(files) {
         var self = this;
         this._upload(function() {
            self._loading = true;
            if (self._options.showIndicator) {
               self._showIndicator();
            }

            var steps = {};
            $ws.helpers.forEach(files, function(file) {
               steps[file.name] = self._xhrSendOneFile(file, file.name);
            });

            new $ws.proto.ParallelDeferred({
               steps: steps,
               stopOnFirstError: false
            }).done().getResult().addBoth(function(results) {
               self._postFinished(results);
            });
         });
      },

      /**
       * Загружает файл на сервер через xhr
       * @param blob - файл
       * @param [fileName] - имя файла
       * @return {$ws.proto.Deferred}
       * @protected
       */
      _xhrSendOneFile: function(blob, fileName) {
         var
            def = new $ws.proto.Deferred(),
            params = this._getRequestParameters(),
            xhr = new XMLHttpRequest(),
            formData = new FormData(),
            request_params = {
               'Файл': {
                  'Данные': {
                     'href': 'file1'
                  }
               }
            };

         $ws.core.merge(request_params['Файл'], params['fileParams']);
         $ws.core.merge(request_params, params['requestParams']);

         if (fileName) {
            formData.append('file1', blob, fileName);
         } else {
            formData.append('file1', blob);
         }
         formData.append('Запрос', $ws.helpers.jsonRpcPreparePacket(this._options.method, request_params).reqBody);

         xhr.open('POST', this._targetUrl, true);
         xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
               var result;
               if (xhr.status >= 200) {
                  result = xhr.responseText;
               }
               def.callback(result);
            }
         };
         xhr.send(formData);
         return def;
      },

      /**
       * Вызывается перед загрузкой файла
       * @param {Function} callback Callback-функция, которая вызовется после события onLoadStarted
       * @protected
       */
      _upload: function(callback) {
         $ws.helpers.callbackWrapper(this._notify('onLoadStarted'), function(r) {
            if (r !== false) {
               callback(r);
            }
            return r;
         });
      },

      //////////////////////////////////////////
      /// Вся работа с плагином тут
      //////////////////////////////////////////

      /**
       * Инициализация плагина загрузки файла
       * @protected
       */
      _getFileLoaderPlugin: function() {
         return this._getPlugins('FileLoader', '0.0.0.5');
      },

      /**
       * Инициализация плагина
       * @param {String} pluginName - Название плагина
       * @param {String} pluginVersion - Версия плагина
       * @param {Object} [params] - Параметры
       * @protected
       */
      _getPlugins: function(pluginName, pluginVersion, params) {
         var self = this;
         if (self._plugin[pluginName] && self._plugin[pluginName]._getState() === PluginManager.readyState.OPEN) {
            return (new $ws.proto.Deferred()).callback(self._plugin[pluginName]);
         } else {
            return PluginManager.getPlugin(pluginName, pluginVersion, params).addCallbacks(function(plugin) {
               self._plugin[pluginName] = plugin;
               return plugin;
            }, function(error) {
               self._logError(error, pluginName);
               self._plugin[pluginName] = null;
               return error;
            });
         }
      },

      /**
       * Вызвает метод загрузки файлов для основного выбора файлов
       * Из-за мультивыбора пришлось извращаться
       * @param file
       * @private
       */
      _pluginSendOneFile: function(file) {
         var self = this,
             requestParams = self._getRequestParameters();

         requestParams.fileName = file.path;
         return this._getFileLoaderPlugin().addCallback(function(plugin) {
            return plugin.uploadFile(requestParams);
         });
      },

      /**
       * После завершении получения файла вызвает onChange и затем загружает файл на сервер
       * Метод вызвается только тогда, когда работаем через плагин
       * @param {String} uploadedFile Имя загружаемого файла
       * @protected
       */
      _post: function(uploadedFile) {
         if (!uploadedFile || uploadedFile == 'undefined') {
            return;
         }

         var paths = uploadedFile.split(','),
             self = this,
             files = {},
             steps = {};

         this._getFileLoaderPlugin().addCallback(function(plugin) {
            var pdef = new $ws.proto.ParallelDeferred({stopOnFirstError: false});
            $ws.helpers.forEach(paths, function(path) {
               pdef.push(plugin.getFileInfo(path).addCallback(function(fileInfo) {
                  fileInfo = JSON.parse(fileInfo);
                  fileInfo.lastModifiedDate = Date.fromSQL(fileInfo.lastModifiedDate);
                  if (self._notify('onChange', fileInfo.name, fileInfo) !== false) {
                     files[fileInfo.name] = fileInfo;
                  }
               }));
            });

            pdef.done().getResult().addBoth(function() {
               self._curval = Object.keys(files).join(',');
               if (Object.isEmpty(files)) {
                  self._log('Не выбраны файлы для загрузки.', 'FileLoaderAbstract');
                  return false;
               }

               self._upload(function() {
                  if (!self._isDestroyed) {
                     self._loading = true;
                     if (self._options.showIndicator) {
                        self._showIndicator();
                     }

                     $ws.helpers.forEach(files, function(file) {
                        steps[file.name] = self._pluginSendOneFile(file);
                     });

                     new $ws.proto.ParallelDeferred({
                        steps: steps,
                        stopOnFirstError: false
                     }).done().getResult().addBoth(function(results) {
                        self._postFinished(results);
                     });
                  }
               });
            });
         });
      },

      //////////////////////////////////////////
      /// Конец
      //////////////////////////////////////////

      /**
       * <wiTag group="Данные">
       * Устанавливает параметры при загрузке файла
       * @param {Object} params Объект с параметрами
       * @example
       * <pre>
       *       {
       *          field: 10, // параметр и значение
       *          field2: {
       *             fieldName: '@Лицо' // параметр связанный с полем контекста
       *          }
       *       }
       * </pre>
       */
      setUploadParams: function(params) {
         this._options.queryFilter = {};
         this._options.paramsMapping = {};
         this._options.filterParams = [];
         for (var i in params) {
            if (params.hasOwnProperty(i)) {
               var p = params[i];
               this._options.filterParams.push(i);
               if (p && typeof(p) == 'object' && 'fieldName' in p) {
                  this._options.paramsMapping[i] = p.fieldName;
               } else {
                  this._options.queryFilter[i] = p;
               }
            }
         }
      },

      /**
       * <wiTag group="Данные">
       * Изменяет целевой метод бизнес-логики для отправки файла
       * @param {String} methodName имя целевого метода бизнес-логики
       * @example
       * <pre>
       *    var control = $ws.single.ControlStorage.gtByName('Кнопка загрузки файла');
       *    control.setTargetMethod( 'Документ.ПрикрепитьФайл' );
       * </pre>
       */
      setTargetMethod: function(methodName) {
         this._options.method = methodName;
      },

      /**
       * <wiTag group="Данные">
       * Возвращает имя последнего выбранного файла
       * @example
       * <pre>
       *    if( this.getFileName() === 'sbis.exe' )
       *       return true;
       * </pre>
       * @deprecated
       * @return {String}
       */
      getFileName: function() {
         $ws.single.ioc.resolve('ILogger').log('FileLoaderAbstract', 'Функция getFileName помечена как deprecated и будет удалена с 3.8. Используйте событие onChange');
         return this._notFormatedVal();
      },

      /**
       * Происходит ли выбор или загрузка файла в текущий момент
       */
      isLoading: function() {
         return this._loading;
      },

      //////////////////////////////////////////
      /// Setters
      //////////////////////////////////////////
      setShowIndicator: function(showIndicator) {
         this._options.showIndicator = !!showIndicator;
      },

      setFilterParams: function(filterParams) {
         if (filterParams instanceof Array) {
            this._options.filterParams = filterParams;
         }
      },

      setParamsMapping: function(paramsMapping) {
         if (typeof(paramsMapping) === 'object') {
            this._options.paramsMapping = paramsMapping;
         }
      },

      setQueryFilter: function(queryFilter) {
         if (typeof(queryFilter) === 'object') {
            this._options.queryFilter = queryFilter;
         }
      },

      /**
       * Установить метод загрузки файлов
       * @param method
       */
      setMethod: function(method) {
         if (typeof(method) === 'string') {
            this._options.method = method;
         }
      },

      setOtherUrl: function(otherUrl) {
         if (typeof(otherUrl) === 'string') {
            this._options.otherUrl = otherUrl;
         }
      },

      //////////////////////////////////////////
      /// Getters
      //////////////////////////////////////////
      getShowIndicator: function() {
         return this._options.showIndicator;
      },

      getFilterParams: function() {
         return this._options.filterParams;
      },

      getParamsMapping: function() {
         return this._options.paramsMapping;
      },

      getQueryFilter: function() {
         return this._options.queryFilter;
      },

      getMethod: function() {
         return this._options.method;
      },

      getOtherUrl: function() {
         return this._options.otherUrl;
      }
   });

   return $ws.proto.FileLoaderAbstract;

});