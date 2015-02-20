/**
 * Модуль 'Компонент кнопка сканирования'.
 * Умеет сканировать документы, и если надо создавать свой даилог сканирования
 *
 * @description
 */
define('js!SBIS3.CORE.FileScanLoader', [
   'js!SBIS3.CORE.FileLoaderAbstract',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CORE.PluginSetupDialog'
], function(FileLoaderAbstract, Dialog) {

   'use strict';

   /// В отличии от FileBrowse, при сканировании нам нужен всегда один экземпляр плагина,
   /// поэтому метод _getPlugin вызывается один раз и надеемся, что он не умрет.
   /// Да пребудет с нами Сила.

   //////////////////////////////////////////
   /// Все вызовы методов у плагина тут
   //////////////////////////////////////////

   /**
    * Получить текущую информацию о сканерах
    * @param plugin
    * @returns {$ws.proto.Deferred}
    */
   function getScannersInfo(plugin) {
      return new $ws.proto.ParallelDeferred({
         steps: {
            scanners: getScanners(plugin),
            lastScanner: getLastScanner(plugin)
         },
         stopOnFirstError: false
      }).done().getResult();
   }

   /**
    * Выдает все сканеры, которые доступны
    * @param plugin
    * @returns {$ws.proto.Deferred}
    */
   function getScanners(plugin) {
      return plugin.getDeviceNames().addErrback(LogError);
   }

   /**
    * Последний используемый сканер
    * @param plugin
    * @returns {$ws.proto.Deferred}
    */
   function getLastScanner(plugin) {
      return plugin.getLastSelectedDevice().addErrback(LogError);
   }

   /**
    * Выбрать сканер
    * @param plugin
    * @param scanner
    */
   function selectScanner(plugin, scanner) {
      return plugin.selectDevice(scanner).addErrback(LogError);
   }

   /**
    * Вызывает диалог сканера, ждет 10 минут ответа
    * @param plugin
    * @returns {$ws.proto.Deferred}
    */
   function scan(plugin) {
      plugin._setQueryTimeout(10 /*min*/ * 60 /*sec*/ * 1000);
      return plugin.scan().addErrback(LogError);
   }

   /**
    * Говорим плагину, чтобы начал подготовку к загрузке файлов, и дал нам путь до файла, который будем грузить
    * @param plugin
    * @param id
    * @returns {$ws.proto.Deferred}
    */
   function upload(plugin, id) {
      return plugin.upload(id).addErrback(LogError);
   }

   //////////////////////////////////////////
   /// Конец
   //////////////////////////////////////////

   /**
    * Показывает диалог выбора сканера
    * @param deferred
    * @param plugin
    */
   function showDialog(deferred, plugin) {
      // Показываем диалог выбора сканеров
      new Dialog({
         template: 'js!SBIS3.CORE.SelectScannerDialog',
         context: new $ws.proto.Context(),
         caption: 'Выбор устройства сканирования',
         opener: $ws.single.WindowManager.getActiveWindow(),
         resizable: false,
         border: false,
         handlers: {
            onBeforeShow: function() {
               var dialog = this,
                   recordSet = new $ws.proto.RecordSetStatic(),
                   browser = dialog.getChildControlByName('selectBrowser'),
                   button = dialog.getChildControlByName('reloadScanners'),
                   close = dialog.getChildControlByName('closeButton');

               this._reloadScanners = reloadScanners.bind(this, plugin, recordSet, browser);
               this._reloadScanners();

               // Создадим рекордсет
               recordSet.addColumn('Название', 'Текст');
               browser.subscribe('onRowClick', function(event, row, rec) {
                  selectScanner(plugin, rec.getKey()).addBoth(function() {
                     dialog.close(true);
                  });
               });

               button.subscribe('onActivated', function() {
                  dialog._reloadScanners();
               });

               close.subscribe('onActivated', function() {
                  dialog.close(false);
               });
            },
            onAfterClose: function(event, result) {
               if (result) {
                  deferred.callback();
               } else {
                  deferred.errback();
               }
            }
         }
      });
   }

   /**
    * Перезагружает список сканеров
    * @param plugin
    * @param recordSet
    * @param browser
    */
   function reloadScanners(plugin, recordSet, browser) {
      var records = [];
      recordSet.clear();

      getScannersInfo(plugin).addCallback(function(info) {
         info.scanners = info.scanners || [];
         info.lastScanner = info.lastScanner || '';
         $ws.helpers.forEach(info.scanners, function(id, i) {
            records[i] = new $ws.proto.Record({row: [id], colDef: recordSet.getColumns(), pkValue: id});
         });

         if (info.lastScanner && info.scanners.toString().indexOf(info.lastScanner) === -1) {
            records[records.length] = new $ws.proto.Record({row: [info.lastScanner + ' (не подключен)'], colDef: recordSet.getColumns(), pkValue: info.lastScanner});
         }

         recordSet.setRecords(records);
         browser.setData(recordSet);

         if (info.lastScanner && info.scanners.toString().indexOf(info.lastScanner) === -1) {
            browser.getContainer().find('tr[rowkey="' + info.lastScanner + '"]').addClass('not_available');
         }
      });
   }

   /**
    * Узнаем какой сканер использовать
    * 1. Если нет ни одного выбранного сканера, и вообще ни одного сканера, сообщаем пользователю
    * 2. Если нет ни одного выбранного сканера, и сканеров больше 2х, выдаем диалог с выбором сканеров
    * 3. Если выбран сканер, но он не подключен, выдаем диалог с выбором сканеров
    * 4. Если выбран сканер, но он не подключен, и есть другой сканер, выдаем диалог с выбором сканеров, и
    *    неподключеный будет серым, а второй сканер черным и его можно выбрать
    * @param plugin
    */
   function prepareScanner(plugin) {
      var deferred = new $ws.proto.Deferred();

      function _selectScanner(scanner) {
         selectScanner(plugin, scanner).addCallbacks(function() {
            deferred.callback();
         }, function() {
            deferred.errback(new Error('Не удалось выбрать устройство сканирования'));
         });
      }

      getScannersInfo(plugin).addCallback(function(info) {
         info.scanners = info.scanners || [];
         info.lastScanner = info.lastScanner || '';
         if (!info.lastScanner) {
            if (info.scanners.length === 0) {
               deferred.errback(new Error('Устройства сканирования не найдены'));
            } else if (info.scanners.length === 1) {
               _selectScanner(info.scanners[0]);
            } else if (info.scanners.length > 1) {
               showDialog(deferred, plugin);
            }
         } else if (info.scanners.toString().indexOf(info.lastScanner) === -1) {
            showDialog(deferred, plugin);
         } else {
            _selectScanner(info.lastScanner);
         }
      });

      return deferred;
   }

   function Log(message) {
      FileLoaderAbstract.prototype._log.call(undefined, message, 'FileScanLoader');
      return message;
   }

   function LogError(error) {
      FileLoaderAbstract.prototype._logError.call(undefined, error, 'FileScanLoader');
      return error;
   }

   /**
    * @class $ws.proto.FileScanLoader
    * @extends $ws.proto.FileLoaderAbstract
    * @control
    */
   $ws.proto.FileScanLoader = FileLoaderAbstract.extend(/** @lends $ws.proto.FileScanLoader.prototype */{
      $protected : {
         _options : {
            /**
             * @cfg {Boolean} Сжимать несколько файлов в один zip архив
             * <wiTag group="Управление">
             * Если true, то несколько отсканированных файлов будут помещены в zip-архив и загружен будет уже архив
             * Если false, то несколько отсканированных файлов будут загружены по отдельности
             */
            createZip: true
         }
      },
      $constructor: function(){
         this._container = $(); // контейнер не нужен!
         $ws.single.CommandDispatcher.declareCommand(this, 'scan', this.scan);
         // Показываем индикатор только когда раньше было - показывать с диалогом
         if (!this._options.showInterface)
            this._options.showIndicator = false;
      },

      /**
       * Инициализация плагина сканирования
       * @private
       */
      _getPlugin: function() {
         return this._getPlugins('Scanner', '1.0.0.4', {'createZip': this._options.createZip});
      },

      /**
       * Вызывает диалог сканера
       * @private
       */
      _scan: function(plugin) {
         var self = this;
         this._notify('onAppletReady', self._randomId, plugin);
         scan(plugin).addCallback(function(result) {
            if (result) {
               upload(plugin, self._randomId).addCallback(self._post.bind(self));
            } else {
               Log('Сканирование отменено');
            }
         });
      },

      /**
       * Узнает каким сканером пользоваться
       * @private
       */
      _prepareScanner: function(plugin) {
         if (!this._pluginOpen) {
            this._pluginOpen = true;
            var self = this;
            prepareScanner(plugin).addCallbacks(self._scan.bind(self, plugin), function(error) {
               if (!self._notify('onAppletReady', self._randomId, null, error)) {
                  $ws.helpers.alert(error.message, {}, self);
               }
            }).addBoth(function() {
               self._pluginOpen = false;
            });
         }
      },

      /**
       * Сканировать изображение и залить его на сервер
       * @returns {$ws.proto.Deferred}
       */
      scan: function() {
         var self = this;
         return self._getPlugin().addCallbacks(self._prepareScanner.bind(self), function(error) {
            self._notify('onAppletReady', self._randomId, null, error);
         });
      },

      //////////////////////////////////////////
      /// Setters
      //////////////////////////////////////////
      setCreateZip: function(createZip) {
         this._options.createZip = !!createZip;
      },

      //////////////////////////////////////////
      /// Getters
      //////////////////////////////////////////
      getCreateZip: function() {
         return this._options.createZip;
      }
   });

   return $ws.proto.FileScanLoader;
});