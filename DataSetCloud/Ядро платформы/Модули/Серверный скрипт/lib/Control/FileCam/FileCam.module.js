/**
 * Модуль 'Компонент кнопка загрузки файла с камеры'.
 * @description
 */
define('js!SBIS3.CORE.FileCam', [
   'js!SBIS3.CORE.FileButton',
   'js!SBIS3.CORE.FileCamLoader'
], function(FileButton, FileCamLoader) {

   'use strict';

   /**
    * @class $ws.proto.FileCam
    * @extends $ws.proto.FileButton
    * @control
    * @category Button
    * @initial
    * <component data-component='SBIS3.CORE.FileCam' style='width: 100px'>
    *    <option name='caption'>FileCam</option>
    * </component>
    * @designTime plugin /design/DesignPlugin
    */
   $ws.proto.FileCam = FileButton.extend(/** @lends $ws.proto.FileCam.prototype */{

      _createButton: function(options) {
         return new FileCamLoader($ws.core.merge(options, {
            name: this._options.name ? this._options.name + '-FileCamLoader' : '',
            opener: this
         }));
      },

      /**
       * <wiTag group="Управление">
       * Получить изображение с камеры и загрузить его
       * Работаем через плагин
       */
      getImage: function() {
         return this.activate();
      },

      _activate: function() {
         return this._fileButton.getImage();
      }
   });

   return $ws.proto.FileCam;

});