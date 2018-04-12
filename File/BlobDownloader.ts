/// <amd-module name='File/BlobDownloader' />
import detection = require('Core/detection');

/**
 * @class File/BlobDownloader
 * @public
 * @author Ибрагимов А.А
 * @description Компонент для загрузки Blob'a
 * @example
 * <pre>
 *    require(['File/BlobDownloader'], function(BlobDownloader) {
 *       var blob = new Blob(['<a id="a"><b id="b">hey!</b></a>'], {type : 'text/html'});
 *       new BlobDownloader(blob, 'index.html');
 *    });
 * </pre>
 */
class BlobDownloader {
   /**
    * @name  File/BlobDownloader
    * @constructor
    * @param {Blob} blob экземпляр {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob Blob}
    * @param {String} [name='unnamed.zip'] Имя файла
    */
   constructor(blob: Blob, name: string = 'unnamed.zip') {
      if (detection.isIE) {
         window.navigator.msSaveOrOpenBlob(blob, name);
         return;
      }
      let url: string = URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link).click();
      URL.revokeObjectURL(url);
   }
}
export = BlobDownloader;