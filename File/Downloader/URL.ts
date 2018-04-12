/// <amd-module name='File/Downloader/URL' />
import constants = require('Core/constants');
import detection = require('Core/detection');

/**
 * @class File/Downloader/URL
 * @public
 * @author Ибрагимов А.А
 * @description Компонент для инициализации загрузки файла.
 * @param {String} url url-адрес файла
 * @example
 * <pre>
 *    require(['File/Downloader/URL'], function(DownloaderURL) {
 *       new DownloaderURL('https://example.com/folder/filename');
 *    });
 * </pre>
 */
class DownloaderURL {
   /**
    * @class File/Downloader/URL
    * @constructor
    * @param {String} URL Адрес файла
    * @param {String} [filename=URL] Имя файла
    */
   constructor(url: string, filename?: string) {
      if (detection.isMobilePlatform) {
         this.downloadForMobile(url);
         return;
      }
      if (detection.safari) {
         this.downloadByIframe(url);
         return;
      }
      this.downloadByA(url, filename || url);
   }

   /**
    * @protected
    * @method
    * @description Загрузка через невидимый <b>iframe</b> для FireFox и Safari
    */
   protected downloadByIframe(url: string): void {
      let iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.setAttribute('style', 'width:0px; height:0px; display:none; border:0px;');
      document.body.appendChild(iframe);
   }

   /**
    * @protected
    * @method
    * @description Загрузка через невидимый <b>a</b> для остальных браузеров
    */
   protected downloadByA(url: string, filename: string): void {
      let link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link).click();
   }

   /**
    * @protected
    * @method
    * @description Загрузка для мобильных браузеров
    */
   protected downloadForMobile(url: string): void {
      window.open(url, '_self');
   }
}
export = DownloaderURL;