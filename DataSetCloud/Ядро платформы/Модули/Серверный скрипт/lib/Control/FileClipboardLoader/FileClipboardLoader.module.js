/**
 * Модуль 'Компонент загрузки скриншота'.
 * Умеет загружать скриншот из буфера обмена на сервер
 * Используется плагин.
 *
 * @description
 */
define('js!SBIS3.CORE.FileClipboardLoader', [
   'js!SBIS3.CORE.FileLoaderAbstract'
], function(FileLoaderAbstract) {

   'use strict';

   /**
    * @class $ws.proto.FileClipboardLoader
    * @extends $ws.proto.FileLoaderAbstract
    * @control
    */
   $ws.proto.FileClipboardLoader = FileLoaderAbstract.extend(/** @lends $ws.proto.FileLoader.prototype */{
      /**
       * Инициализирует инпут выбора файла
       */
      $constructor: function() {
         this._container = $(); // контейнер не нужен!
         $ws.single.CommandDispatcher.declareCommand(this, 'load', this.getScreenshot);
      },

      /**
       * <wiTag group="Управление">
       * Вызывает выбор файла из кода
       * Поскольку клик происходит в коде, в IE8 и в Chrome не работатет.
       * В этом случае работаем через плагин
       */
      getScreenshot: function() {
         var self = this;
         this._getFileLoaderPlugin().addCallbacks(function(plugin) {
            if (!self._isDestroyed) {
               self._notify('onAppletReady', self._randomId, plugin);
               plugin.getScreenshot().addCallbacks(function(result) {
                  if (!result) {
                     $ws.helpers.alert('В буфере обмена нет скриншота', {}, self);
                  }
                  self._post(result);
               }, function(error) {
                  self._logError(error, 'FileClipboardLoader');
               });
            }
         }, function(error) {
            self._notify('onAppletReady', self._randomId, null, error);
         });
      }
   });

   return $ws.proto.FileClipboardLoader;

});