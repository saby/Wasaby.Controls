/// <amd-module name="File/Base64File" />
import DownloaderFile = require('File/Downloader/File');

/**
 * @name Lib/File/Base64File
 * @public
 * @class
 * @author Ибрагимов А.А
 * @description Класс для работы с файлами в кодировке base64.
 * Преобразовывает base64-строку в File
 */
class Base64File /** @lends Lib/File/Base64File.prototype*/ {

   private contentType: string;
   private base64Data: string;
   private file: File;

   /**
    * @name Lib/File/Base64File
    * @constructor
    * @param {String} data Base64 строка
    * @param {String} [contentType='application/zip'] Тип файла
    * @param {String} [name='file.zip'] Имя файла
    */
   constructor(data: string, contentType: string = 'application/zip', private name: string = 'file.zip') {
      if (data.indexOf('data:') === -1) {
         this.base64Data = data;
         this.contentType = contentType;
      } else {
         this.base64Data = data.substring(data.indexOf(',') + 1);
         this.contentType = data.substring(data.indexOf(':') + 1, data.indexOf(';'));
      }

      this.file = this.getFile();
   }

   /**
    * Начинает загрузку файла
    * @public
    */
   public download() {
      new DownloaderFile(this.file);
   }

   /**
    * Конвертирует base64 строку в {@link https://developer.mozilla.org/en-US/docs/Web/API/File File} и возвращает его
    * @public
    * @returns {File} Объект File
    */
   public getFile() {
      const decodedChars: string = atob(this.base64Data);
      const charCodes = new Array(decodedChars.length);
      const bytesArray: Uint8Array[] = [];

      for (let i = 0; i < decodedChars.length; i++) {
         charCodes[i] = decodedChars.charCodeAt(i);
      }
      bytesArray.push(new Uint8Array(charCodes));
      return new File([new Blob(bytesArray, { type: this.contentType })], this.name);
   }
}
export = Base64File;
