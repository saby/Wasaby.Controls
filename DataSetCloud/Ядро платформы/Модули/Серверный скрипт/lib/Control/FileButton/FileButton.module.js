define('js!SBIS3.CORE.FileButton', ['js!SBIS3.CORE.Button'], function(Button) {

   'use strict';

   /**
    * @class $ws.proto.FileButton
    * @extends $ws.proto.Button
    * @category Button
    * @initial
    * <component data-component='SBIS3.CORE.FileBrowse' style='width: 100px'>
    *    <option name='caption'>FileButton</option>
    * </component>
    */
   $ws.proto.FileButton = Button.extend(/** @lends $ws.proto.FileButton.prototype */{
      /**
       * @event onActivated Событие, происходящее при клике на кнопку
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @return {Boolean} Если результат false, то будет отменена загрузка файла
       * @example
       * <pre>
       *    loadFile.subscribe('onActivated', function(event){
       *       if( this.getFileName() === 'sbis.exe' )
       *          event.setResult( true );
       *       else
       *          event.setResult( false ); // Отменим загрузку файла
       *    });
       * </pre>
       */
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
       * @example
       * <pre>
       *    loadFile.subscribe('onChange', function(event, fileName){
       *       record.set('ИмяФайла', fileName);
       *    });
       * </pre>
       */
      /**
       * @cfg {Boolean} Показывать индикатор при загрузке файла
       * @name $ws.proto.FileButton#showIndicator
       * @description
       * <wiTag group="Отображение">
       * Возможные значения:
       * <ul>
       *    <li>true - отображать индикатор во время загрузки файла;</li>
       *    <li>false - не показывать индикатор загрузки.</li>
       * </ul>
       */
      /**
       * @cfg {String[]} Названия параметров метода
       * @name $ws.proto.FileButton#filterParams
       * @description
       * <wiTag group="Данные">
       * Массив названий параметров метода.
       * @example
       * <pre>
       *    ['ИдО', 'Дополнительный параметр', 'Ид']
       * </pre>
       * <pre>
       *     <options name="filterParams" type="array">
       *        <option>ИдО</option>
       *     </options>
       * </pre>
       */
      /**
       * @cfg {Object.<String, Boolean|Number|String>} Название полей из контекста
       * @name $ws.proto.FileButton#paramsMapping
       * @description
       * <wiTag group="Данные">
       * Объект с названиями полей из контекста, которые должны попасть в параметры
       * @example
       * <pre>
       *    {
       *       'ИдО': 123,
       *       'Дополнительный параметр' : '123'
       *    }
       * </pre>
       * <pre>
       *     <options name="paramsMapping">
       *        <option name="ИдО">@ДляКартинки</option>
       *     </options>
       * </pre>
       */
      /**
       * @cfg {Object} Фиксированные параметры метода
       * @name $ws.proto.FileButton#queryFilter
       * @description
       * <wiTag group="Данные">
       * Объект со значениями параметров метода, которые надо взять из контекста
       * @example
       * <pre>
       *    {
       *       'Ид': 'UUID файла'
       *    }
       * </pre>
       */
      /**
       * @cfg {String} Метод загрузки файла на бизнес-логике
       * @name $ws.proto.FileButton#method
       * @description
       * <wiTag group="Данные">
       * Метод загрузки файла на бизнес-логике
       * <pre>
       *    method: 'Документ.ПрикрепитьФайл'
       * </pre>
       * @editor MethodBLChooser
       */
      /**
       * @cfg {String} Адрес сервиса загрузки данных
       * @name $ws.proto.FileButton#otherUrl
       * @description
       * <wiTag group="Управление">
       * Адрес сервиса на который будет загружаться файл
       * <pre>
       *    otherUrl: 'https://wi.sbis.ru/service/sbis-rpc-service300.dll'
       * </pre>
       */
       $protected: {
         _fileButton: undefined
      },

      $constructor: function() {
         this._publish('onLoadStarted', 'onLoaded', 'onAppletReady', 'onProgressState');

         var self = this,
             cfg = {},
             opts = ['createZip', 'extensions', 'multiple', 'showIndicator', 'filterParams', 'paramsMapping', 'queryFilter', 'method', 'otherUrl'];

         $ws.helpers.forEach(opts, function(opt) {
            if (self._options[opt] !== undefined) {
               cfg[opt] = self._options[opt];
            }
         });

         this._fileButton = this._createButton($ws.core.merge(cfg, {
            parent: this.getParent(),
            linkedContext: this.getLinkedContext(),
            handlers: {
               'onLoadStarted': function(event) {
                  event.setResult(self._notify('onLoadStarted'));
               },
               'onLoaded': function(event, response, isFinished) {
                  event.setResult(self._notify('onLoaded', response, isFinished));
               },
               'onProgressState': function(event, percent) {
                  event.setResult(self._notify('onProgressState', percent));
               },
               'onAppletReady': function(event, id, plugin, error) {
                  event.setResult(self._notify('onAppletReady', id, plugin, error));
               },
               'onChange': function(event, fileName) {
                  event.setResult(self._notify('onChange', fileName));
               }
            }
         }));

         // Setters
         $ws.helpers.forEach(opts, function(opt) {
            var func = 'set' + opt[0].toUpperCase() + opt.substr(1);
            if (self._fileButton[func]) {
               self[func] = function() {
                  self._fileButton[func].apply(self._fileButton, arguments);
               }
            }
         });

         // Getters
         $ws.helpers.forEach(opts, function(opt) {
            var func = 'get' + opt[0].toUpperCase() + opt.substr(1);
            if (self._fileButton[func]) {
               self[func] = function() {
                  return self._fileButton[func].apply(self._fileButton, arguments);
               }
            }
         });
      },

      /**
       * Подписывается на клик по кнопке
       * @private
       */
      _onClickHandler: function(event) {
         if (event.which <= 1) {
            var result = this.activate(event);
            if (result instanceof $ws.proto.Deferred) {
               this._toggleProcess(true);
               result.addBoth(this._toggleProcess.bind(this, false));
            }

            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
            return false;
         }
         return true;
      },

      setUploadParams: function(params) {
         return this._fileButton.setUploadParams(params);
      },

      setTargetMethod: function(method) {
         return this._fileButton.setTargetMethod(method);
      },

      /**
       * <wiTag group="Данные">
       * Возвращает имя последнего выбранного файла
       * @example
       * <pre>
       *    if( this.getFileName() === 'sbis.exe' )
       *       return true;
       * </pre>
       * @return {String}
       */
      getFileName: function() {
         return this._fileButton.getFileName();
      },

      isLoading: function() {
         return this._fileButton.isLoading();
      },

      /**
       * Создать кнопку загрузки файлов или сканирования
       * @param {Object} options
       * @private
       */
      _createButton: function(options) {
         throw new Error('FileButton:_createButton must be implemented in child classes');
      },

      _activate: function(event) {
         throw new Error('FileButton:_activate must be implemented in child classes');
      },

      /**
       * Активирует кнопку
       * @param [event]
       */
      activate: function(event) {
         if (this.isEnabled() && !this.isLoading() && this._notify('onActivated') !== false) {
            return this._activate(event);
         }

         return false;
      },

      destroy: function() {
         this._fileButton && this._fileButton.destroy();
         $ws.proto.FileButton.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.FileButton;

});