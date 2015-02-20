/**
 * Модуль 'Компонент кнопка загрузки скриншота'.
 * Умеет загружать скриншот из буфера обмена на сервер
 * Использует модуль загрузки и выбора файлов FileLoader
 * @description
 */
define('js!SBIS3.CORE.FileClipboard', [
   'js!SBIS3.CORE.FileButton',
   'js!SBIS3.CORE.FileClipboardLoader'
], function(FileButton, FileClipboardLoader) {

   'use strict';

   /**
    * @class $ws.proto.FileClipboard
    * @extends $ws.proto.FileButton
    * @control
    * @category Button
    * @initial
    * <component data-component='SBIS3.CORE.FileClipboard' style='width: 100px'>
    *    <option name='caption'>FileClipboard</option>
    * </component>
    * @designTime plugin /design/DesignPlugin
    */
   $ws.proto.FileClipboard = FileButton.extend(/** @lends $ws.proto.FileClipboard.prototype */{

      _createButton: function(options) {
         return new FileClipboardLoader($ws.core.merge(options, {
            name: this._options.name ? this._options.name + '-FileClipboardLoader' : ''
         }));
      },

      /**
       * <wiTag group="Управление">
       * Вызывает выбор файла из кода
       * Поскольку клик происходит в коде, в IE8 и в Chrome не работатет.
       * В этом случае работаем через плагин
       */
      getScreenshot: function() {
         return this.activate();
      },

      _activate: function() {
         this._fileButton.getScreenshot();
      }
   });

   return $ws.proto.FileClipboard;

});