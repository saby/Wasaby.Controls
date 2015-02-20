/**
 * Модуль 'Компонент загрузки файла'.
 * Умеет загружать файлы на сервер
 * Использует стандартный input для выбора файлов
 * В случае вызова диалога выбора из кода методом selectFile,
 * Используется для Chrome плагин. Для IE8 всегда используется ActiveX
 *
 * @description
 */
define('js!SBIS3.CORE.FileLoader', [
   'js!SBIS3.CORE.FileLoaderAbstract',
   'html!SBIS3.CORE.FileLoader',
   'json!SBIS3.CORE.FileLoader/resources/MimeTypes',
   'css!SBIS3.CORE.FileLoader'
], function(FileLoaderAbstract, dotTplFn, MimeTypes) {

   'use strict';

   /**
    * @class $ws.proto.FileLoader
    * @extends $ws.proto.FileLoaderAbstract
    * @control
    */
   $ws.proto.FileLoader = FileLoaderAbstract.extend(/** @lends $ws.proto.FileLoader.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         _fakeButton: undefined,
         _inputControl: null,
         _options: {
            /**
             * @cfg {Array} Список расширений выбираемых файлов
             * <wiTag group="Управление">
             * Массив расширений, разрешенных для выбора, в случае выбора через плагин
             * <pre>
             *    extensions: ['exe','jpg','png']
             * </pre>
             */
            extensions: [],
            /**
             * @cfg {Boolean} Выбрать несколько файлов
             * <wiTag group="Управление">
             * Позволяет выбрать несколько файлов
             * <pre>
             *    multiple: true
             * </pre>
             */
            multiple: false
         },
         _pluginOpen: false
      },

      /**
       * Инициализирует инпут выбора файла
       */
      $constructor: function() {
         $ws.single.CommandDispatcher.declareCommand(this, 'load', this.selectFile);

         var self = this;
         this._fakeButton = $(this._container).find('.FileLoader-input_file')
            .change(function() {
               self._changeInput($(this)[0].files);
            })
            .bind('click', function(event) {
               event.stopPropagation();
            });

         if (this._options.extensions.length) {
            if (typeof this._options.extensions == 'string') {
               this._options.extensions = this._options.extensions.split(',');
            }

            this._fakeButton.attr('accept', this._createExtensionMimeTypes());
         }
      },

      _changeInput: function(selectedFiles) {
         var self = this,
             files = {};
         $ws.helpers.forEach(selectedFiles, function(file) {
            // Отфильтруем расширения
            if (self._options.extensions.length && !self._verifyFileExtension(file)) {
               self._notify('onChange', new Error('Выбранный файл неверного типа'), file);
            } else if (self._notify('onChange', file.name, file) !== false) {
               files[file.name] = file;
            }
         });

         self._curval = Object.keys(files).join(',');
         if (!Object.isEmpty(files)) {
            self._postInput(files);
         } else {
            self._log('Не выбраны файлы для загрузки.', 'FileLoader');
         }
      },

      /**
       * Формируем массив mime-type из extensions
       * @returns {string}
       * @private
       */
      _createExtensionMimeTypes: function() {
         var str = [];
         $ws.helpers.forEach(this._options.extensions, function(ext) {
            if (ext == 'audio' || ext == 'video' || ext == 'image') {
               str.push(ext + '/*');
            } else if (ext in MimeTypes) {
               str.push(MimeTypes[ext]);
            }
         });

         return str.join(',');
      },

      /**
       * Проверяет файл на валидность расширения
       * @param file
       * @returns {Boolean}
       * @private
       */
      _verifyFileExtension: function(file) {
         var extension = file.name.match(/^\S[\S\s]*\.([\S]+)$/),
             type = file.type || '',
             ext, key, len;

         extension = extension ? extension[1].toLowerCase() : '';
         if (this._options.extensions.indexOf(extension) != -1) {
            return true;
         } else if (type) {
            for (key in MimeTypes) {
               if (MimeTypes.hasOwnProperty(key) && MimeTypes[key] === type &&
                   Array.indexOf(this._options.extensions, key) != -1) {
                  return true;
               }
            }
         }

         for (key = 0, len = this._options.extensions.length; key < len; key++) {
            ext = this._options.extensions[key];
            if ((ext == 'audio' || ext == 'video' || ext == 'image') &&
                Array.indexOf(MimeTypes[ext], extension) != -1) {
               return true;
            }
         }

         return false;
      },

      /**
       * <wiTag group="Управление">
       * Непосредство загружает файл на сервер,
       * предпологается, что файл уже выбран
       */
      _postInput: function(files) {
         this._xhrPost(files);
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
                  plugin.chooseFile(self._options.extensions, self._options.multiple).addCallbacks(function(result) {
                     self._postPlugin(result);
                  }, function(error) {
                     self._logError(error, 'FileLoader');
                  });
               }
            }
         }, function(error) {
            self._notify('onAppletReady', self._randomId, null, error);
         });
      },

      /**
       * Вызывается перед загрузкой файлов
       * @param {Object} files Выбранный файл
       */
      _postPlugin: function(files) {
         this._pluginOpen = false;

         this._post(files);
      },

      //////////////////////////////////////////
      /// Конец
      //////////////////////////////////////////

      /**
       * <wiTag group="Управление">
       * Вызывает выбор файла из кода
       * Поскольку клик происходит в коде, в IE8 и в Chrome не работатет.
       * В этом случае работаем через плагин
       */
      selectFile: function(event) {
         if (!event) {
            // Может команда пришла из кнопки, поищем в контексте
            event = this.getLinkedContext().getValue('Event');
         }
         // В IE8-9 и в хроме из за безопасности не работают программные клики
         // В FF не работают программный клик, если до этого было нажатие на клавиатуре
         if ($ws._const.browser.isIE8 || $ws._const.browser.isIE9 ||
             (!(event && event.which) && $ws._const.browser.chrome) ||
             (!(event && event.which) && $ws._const.browser.firefox)) {
            this._runFileChooserPlugin();
         } else {
            // Хром перестает стрелять change'ом если выбрать тот же файл
            this._fakeButton.attr('value', '');
            this._fakeButton.click();
         }
      },

      //////////////////////////////////////////
      /// Setters
      //////////////////////////////////////////
      setExtensions: function(extensions) {
         if (extensions instanceof Array) {
            this._options.extensions = extensions;
         }
      },

      //////////////////////////////////////////
      /// Getters
      //////////////////////////////////////////
      getExtensions: function() {
         return this._options.extensions;
      }
   });

   return $ws.proto.FileLoader;

});