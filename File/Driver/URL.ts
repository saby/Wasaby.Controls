/// <amd-module name='File/Driver/URL' />
import DriverInterface = require('File/Driver/Interface');
import detection = require('Core/detection');

/**
 * @public
 * @class File/Driver/URL
 * @author Ибрагимов А.А
 * @description Файловый драйвер для скачивания файлов по URL
 * <pre>
 * require(['File/Driver/URL'], function(URLDriver) {
 *    var url_document = "/file-transfer/file.pdf"
 *    new URLDriver(url_document).download();
 * });
 * </pre>
 */
class URL implements DriverInterface {
   
   /**
    * @constructor
    * @param {Strign} url URL файла
    */
   constructor(private url: string) { }

   /**
    * @public
    * @method
    * @description Начинает загрузку файла
    */
   public download() {
      if (detection.isMobilePlatform) {
         window.open(this.url, '_self');
         return;
      }
      if (detection.firefox || detection.safari) {
         this.downloadByIframe(this.url);
         return;
      }
      this.downloadByA(this.url);
   }

   private downloadByA(url: string) {
      var link = document.createElement('a');
      link.href = url;
      link.download = url;
      document.body.appendChild(link).click();
   }

   private downloadByIframe(url: string) {
      var iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.setAttribute('style', 'width:0px; height:0px; display:none; border:0px;');
      document.body.appendChild(iframe);
   }
}
export = URL;
