/**
 * Модуль 'Компонент кнопка загрузки файла'.
 * Умеет загружать файлы на сервер
 * Использует модуль загрузки и выбора файлов FileLoader
 * @description
 */
define('js!SBIS3.CORE.FileBrowse', [
   'js!SBIS3.CORE.FileButton',
   'js!SBIS3.CORE.FileLoader'
], function(Button, FileLoader) {

   'use strict';

   /**
    * @class $ws.proto.FileBrowse
    * @extends $ws.proto.FileButton
    * @control
    * @category Button
    * @initial
    * <component data-component='SBIS3.CORE.FileBrowse' style='width: 100px'>
    *    <option name='caption'>FileBrowse</option>
    * </component>
    * @designTime plugin /design/DesignPlugin
    */
   $ws.proto.FileBrowse = Button.extend(/** @lends $ws.proto.FileBrowse.prototype */{
   /**
    * @cfg {Array} Список расширений выбираемых файлов
    * @name $ws.proto.FileBrowse#extensions
    * <wiTag group="Управление">
    * Массив расширений, разрешенных для выбора, в случае выбора через плагин.
    * @example
    * <pre>
    *    extensions: ['exe','jpg','png']
    * </pre>
    */
   /**
    * @cfg {Boolean} Выбрать несколько файлов
    * @name $ws.proto.FileBrowse#multiple
    * <wiTag group="Управление">
    * Позволяет выбрать несколько файлов.
    * @example
    * <pre>
    *    multiple: true
    * </pre>
    */

      _createButton: function(options) {
         var fileLoaderContainer = $('<div class="ws-file-loader"></div>');
         this._container.append(fileLoaderContainer);
         return new FileLoader($ws.core.merge(options, {
            element: fileLoaderContainer,
            name: this._options.name ? this._options.name + '-FileLoader' : ''
         }));
      },

      /**
       * <wiTag group="Управление">
       * Вызывает выбор файла из кода
       * Поскольку клик происходит в коде, в IE8 и в Chrome не работатет.
       * В этом случае работаем через плагин
       */
      selectFile: function(event) {
         return this.activate(event);
      },

      _activate: function(event) {
         this._fileButton.selectFile(event);
      }
   });

   return $ws.proto.FileBrowse;

});