/// <amd-module name="File/Base64Blob" />
import BlobDownloader = require('File/BlobDownloader');

/**
 * @name File/Base64Blob
 * @public
 * @class
 * @author Ибрагимов А.А
 * @description Класс для работы с файлами в кодировке base64.
 * Преобразовывает base64-строку в Blob, позволяя сохранить его локально
 */
class Base64File /** @lends Lib/File/Base64File.prototype*/ {
   private contentType: string;
   private base64Data: string;
   private blob: Blob;

   /**
    * @name File/Base64File
    * @constructor
    * @param {String} data Base64-строка
    * @param {String} [contentType='application/zip'] Тип файла
    */
   constructor(data: string, contentType: string = 'application/zip') {
      if (!data) {
         throw new Error('Argument "data" is required for constructor!');
      }
      if (data.indexOf('data:') === -1) {
         this.base64Data = data;
         this.contentType = contentType;
      } else {
         this.base64Data = data.substring(data.indexOf(',') + 1);
         this.contentType = data.substring(data.indexOf(':') + 1, data.indexOf(';'));
      }

      this.blob = this.getBlob();
   }

   /**
    * Конвертирует base64 строку в {@linkhttps://developer.mozilla.org/ru/docs/Web/API/Blob Blob} и возвращает его
    * @public
    * @returns {Blob} Объект Blob
    */
   public getBlob() {
      const decodedChars: string = atob(this.base64Data);
      const charCodes = new Array(decodedChars.length);
      const bytesArray: Uint8Array[] = [];

      for (let i = 0; i < decodedChars.length; i++) {
         charCodes[i] = decodedChars.charCodeAt(i);
      }
      bytesArray.push(new Uint8Array(charCodes));
      return new Blob(bytesArray, { type: this.contentType });
   }

   /**
    * @public
    * @method
    * @param {String} [name='unnamed.zip'] Имя файла
    * @description Начинает загрузку Blob'a
    * @example 
    * <pre>
    *    require(['File/Base64Blob'], function(Base64File) {
    *       var data = "UGFjaWZpYyBSaW0=";
    *       var blob = new Base64Blob(data);
    *       blob.saveAs('secret.txt');
    *     });
    * </pre>
    */
   public saveAs(name: string = 'unnamed.zip') {
      new BlobDownloader(this.blob, name);
   }
}
export = Base64File;
