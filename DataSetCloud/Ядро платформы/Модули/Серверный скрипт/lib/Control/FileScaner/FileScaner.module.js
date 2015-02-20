/**
 * Модуль 'Компонент кнопка сканирования'.
 * Умеет сканировать документы
 * @description
 */
define('js!SBIS3.CORE.FileScaner', [
   'js!SBIS3.CORE.FileButton',
   'js!SBIS3.CORE.FileScanLoader'
], function(Button, FileScanLoader) {

   'use strict';

   /**
    * @class $ws.proto.FileScaner
    * @extends $ws.proto.FileButton
    * @control
    * @category Button
    * @initial
    * <component data-component='SBIS3.CORE.FileScaner' style='width: 100px'>
    *    <option name='caption'>FileScaner</option>
    * </component>
    * @designTime plugin /design/DesignPlugin
    */
   $ws.proto.FileScaner = Button.extend(/** @lends $ws.proto.FileScaner.prototype */{
       /**
        * @cfg {Boolean} Сжимать несколько файлов в один zip архив
        * @name $ws.proto.FileScaner#createZip
        * <wiTag group="Управление">
        * Возможные значения:
        * <ul>
        *    <li>true - несколько отсканированных файлов будут помещены в zip-архив и загружен будет уже архив;</li>
        *    <li>false - несколько отсканированных файлов будут загружены по отдельности.</li>
        * </ul>
        */

      _createButton: function(options) {
         return new FileScanLoader($ws.core.merge(options, {
            name: this._options.name ? this._options.name + '-FileScanLoader' : ''
         }));
      },

      /**
       * <wiTag group="Управление">
       * Вызывает сканирование
       * Работаем через плагин
       */
      scan: function() {
         return this.activate();
      },

      _activate: function() {
         return this._fileButton.scan();
      }
   });

   return $ws.proto.FileScaner;

});