/**
 * Модуль 'Компонент загрузки файла'.
 * Умеет загружать файлы  в файловое хранилище
 * Использует стандартный input для выбора файлов
 * В случае вызова диалога выбора из кода методом selectFile,
 * Используется для Chrome плагин. Для IE8 всегда используется ActiveX
 *
 * @description
 */
define('js!SBIS3.CORE.FileStorageLoader', ['js!SBIS3.CORE.FileLoader'], function(FileLoader) {

   'use strict';

   /**
    * @class $ws.proto.FileStorageLoader
    * @extends $ws.proto.FileLoader
    * @control
    */
   $ws.proto.FileStorageLoader = FileLoader.extend(/** @lends $ws.proto.FileStorageLoader.prototype */{
      /**
       * Непосредственно загружает файл на файловое хранилище
       * @param status
       * @param filePath
       * @private
       */
      _postFileStorageFinished: function(status, filePath) {
         var result = '';
         //Проверяем, как закончился запрос
         if (status !== 201) { //Если полученный статус не 201, то картинка на сервере не сохранилась
            switch (status) { //Ругаемся в зависимости от статуса запроса
               case 413:
                  result = 'Размер выбранного изображения превышает максимально допустимый.';
                  break;
               default:
                  result = 'Не удалось загрузить изображение. Повторите попытку.';
            }
         } else {
            result = 'Изображение успешно загружено на сервер';
         }
         this._postFinished(JSON.stringify({
            jsonprc: '2.0',
            result: {
               code: status,
               message: result,
               filePath: filePath
            },
            id: 1,
            protocol: 3
         }));
      },

      /**
       * Загрузка файла на файловое хранилище
       * Не поддерживает множественный выбор файлов
       * @private
       */
      _postInput: function(files) {
         var self = this, file,
             xhr = new XMLHttpRequest(),
             filePath = '/cstorage/img?id=' + $ws.helpers.createGUID(); //Генерируем псевдо-UID (подробности в описании функции "createGUID")

         // Берем первый файл
         for (var i in files) {
            if (files.hasOwnProperty(i) && typeof(i) !== 'function') {
               file = files[i];
               break;
            }
         }

         this._upload(function() {
            self._loading = true;
            //Подготавливаем XHR
            xhr.open('PUT', filePath, true);
            xhr.setRequestHeader('Content-Disposition', "inline; filename*=utf-8''" + encodeURI(file.name));
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.onreadystatechange = function() { //Выполняется по завершению запроса
               if (xhr.readyState == 4) {
                  self._postFileStorageFinished(xhr.status, filePath);
               }
            };
            xhr.send(file);
         });
      },

      //////////////////////////////////////////
      /// Вся работа с плагином тут
      //////////////////////////////////////////

      /**
       * Инициализирует плагин
       * @private
       */
      _runFileChooserPlugin: function() {
         var self = this;
         this._getFileLoaderPlugin().addCallbacks(function(plugin) {
            if (!self._isDestroyed) {
               self._notify('onAppletReady', self._randomId, plugin);
               if (!self._pluginOpen) {
                  self._pluginOpen = true;
                  plugin.chooseFile(self._options.extensions).addCallbacks(function(result) {
                     self._postPlugin(result);
                  }, function(error) {
                     self._logError(error, 'FileStorageLoader');
                  });
               }
            }
         }, function(error) {
            self._notify('onAppletReady', self._randomId, null, error);
         });
      },

      /**
       * Вызывается перед загрузкой файлов
       * @param {String} uploadedFile Выбранный файл
       */
      _postPlugin: function(uploadedFile) {
         this._pluginOpen = false;

         if (!uploadedFile || uploadedFile == 'undefined') {
            return;
         }

         this._notify('onChange', this._curval = decodeURIComponent(uploadedFile));

         var self = this;
         this._upload(function() {
            if (!self._isDestroyed) {
               self._loading = true;
               if (self._options.showIndicator) {
                  self._showIndicator();
               }

               var requestParams = self._getRequestParameters();
               requestParams.fileName = uploadedFile;
               var ret = self._uploadFile(requestParams);
               if (ret instanceof $ws.proto.Deferred) {
                  ret.addErrback(function(error) {
                     if (self._options.showIndicator) {
                        self._hideIndicator();
                     }
                     self._loading = false;
                     self._logError(error);
                  });
               }
            }
         });
      },

      /**
       * Вызвает метод загрузки файлов только для fileStorage
       * @param requestParams
       * @private
       */
      _uploadFile: function(requestParams) {
         var self = this;
         return this._getFileLoaderPlugin().addCallback(function(plugin) {
            var host= [window.location.protocol,window.location.hostname].join('//');
            if (window.location.port && window.location.protocol == 'http:') {
               host += ':' + window.location.port;
            }
            requestParams.targetURL = host + '/cstorage/img?id=' + $ws.helpers.createGUID();
            return plugin.uploadToFileStorage(requestParams).addCallback(function(result) {
               self._postFileStorageFinished(result, requestParams.targetURL);
            });
         });
      }

      //////////////////////////////////////////
      /// Конец
      //////////////////////////////////////////
   });

   return $ws.proto.FileStorageLoader;

});