/// <amd-module name='File/Downloader/File' />
import DownloaderURL = require('File/Downloader/URL');

/**
 * @class File/Downloader/File
 * @public
 * @author Ибрагимов А.А
 * @description Компонент для инициализации загрузки файла
 * @remark Класс-обертка над {@link File/Downloader/URL}
 * @example
 * <pre>
 *    require(['File/Downloader/File'], function(DownloaderFile) {
 *       var file = new File(['foo'], 'foo.txt');
 *       new DownloaderFile(file);
 *    });
 * </pre>
 */
class DownloaderFile {
   /**
    * Значение имени файла по умолчанию
    * @private
    */
   private filename: string = 'file.zip';

   /**
    * @name  File/Downloader/File
    * @constructor
    * @param {File} file экземпляр {@link https://developer.mozilla.org/en-US/docs/Web/API/File File}
    */
   constructor(file: File) {
      let url: string = URL.createObjectURL(file);
      new DownloaderURL(url, file.name || this.filename)
      URL.revokeObjectURL(url);
   }
}
export = DownloaderFile;