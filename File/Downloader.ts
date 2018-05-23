/// <amd-module name='File/Downloader' />
import DriverInterface = require('File/Driver/Interface');
/**
 * Инициализирует загрузку файла
 * @param {string} entity URL документа, либо Base64-строка
 * @param {Object} [options] name - имя файла, contentType - тип файла
 * @param {DRIVERS_NAMES} [driverName] Имя драйвера для работы с данным типом фалйла (см Downloader.DRIVERS_NAMES)
 */
function Downloader(entity: string, options?: Object, driverName?: DRIVERS_NAMES) {
   if (!entity) {
      throw new Error("Некорректный аргумент entity: " + typeof entity);
   }

   require([driverName || DetectDriverName(entity)], function (Driver: DriverInterface) {
      new Driver(entity).download(options);
   });
}

/**
 * Детектирует переданный аргумент и возвращает соответствующий для работы драйвер
 * @param {string} entity  URL документа, либо Base64-строка
 * @return {DRIVERS_NAMES} driverName Имя драйвера для работы с данным типом фалйла (см Downloader.DRIVERS_NAMES)
 */
function DetectDriverName(entity: string) {
   if (entity.indexOf('https://') !== -1 || entity.indexOf('?') !== -1 || entity.indexOf('&') !== -1) {
      return DRIVERS_NAMES.URL;
   }
   return DRIVERS_NAMES.Base64;
}

/**
   Имена драйверов для работы с файлами    
   @name File/Downloader#DRIVERS_NAMES
   @type {enum}
   @readonly
*/
enum DRIVERS_NAMES {
   URL = 'File/Driver/URL',
   Base64 = 'File/Driver/Base64'
}

Downloader['DRIVERS_NAMES'] = DRIVERS_NAMES;
export = Downloader;

/**
 * @public
 * @class File/Downloader
 * @author Ибрагимов А.А
 * @description Модуль для скачивания файлов различных типов
 * <pre>
 * require(['File/Downloader'], function(Downloader) {
 *    var base64_text = "wqtXZWVrcyBvZiBjb2RpbmcgY2FuIHNhdmUgeW91IGhvdXJzIG9mIHBsYW5uaW5nwrssDQogdW5rbm93biBhcnRpc3Qu";
 *    Downloader(base64_text, {
 *         name: 'phrase.txt',
 *         contentType: 'text/plain'
 *     });
 * 
 *    // явное указание FileDriver'a
 *    Downloader(' ', {name: 'nothing.txt'}, 'File/Driver/Base64');
 * 
 *    var url_document = "/file-transfer/file.pdf"
 *    Downloader(url_document);
 * });
 * </pre>
 */

/**
 * @cfg {Entity} URL документа, либо файл в кодировке Base64
 * @name File/Downloader#entity
 */
/** 
 * @typedef {String} Entity URL документа, либо файл в кодировке Base64
 * @example
 * Пример: загрузка документа из FileTransfer
 * <pre class="brush:js">
 *    var url_document = "/file-transfer/file.pdf"
 *    Downloader(url_document);
 * </pre>
 */

/**
 * @cfg {DownloaderOptions} Опции для скачивания
 * @name File/Downloader#options
 */
/** 
 * @typedef {Object} DownloaderOptions
 * @property {String} name имя файла
 * @property {String} contentType тип файла 
 * @remark
 * Игнорируется при загрузке URL
 * @example
 * Пример: загрузка текстового файла, закодированного в base64
 * <pre class="brush:js">
 *    var base64_text = "wqtXZWVrcyBvZiBjb2RpbmcgY2FuIHNhdmUgeW91IGhvdXJzIG9mIHBsYW5uaW5nwrssDQogdW5rbm93biBhcnRpc3Qu";
 *    Downloader(base64_text, {
 *         name: 'phrase.txt',
 *         contentType: 'text/plain'
 *     });
 * </pre>
 */

/**
 * @cfg {FileDriver} Имя файлового драйвера для работы с файлом
 * @name File/Downloader#FileDriver
 */
/** 
 * @typedef {String} FileDriver 
 * @variant 'File/Driver/Base64'
 * @variant 'File/Driver/URL'
 * @description Имена модулей также храняться в Downloader.DRIVERS_NAMES
 * @remark
 * Downloader пытается сам определить тип загружаемого файла, однако желательно явно определить драйвер для работы со скачиваемым файлом.
 * @example
 * Пример: явное указание FileDriver'a
 * <pre class="brush:js">
 *    Downloader(' ', {name: 'nothing.txt'}, 'File/Driver/Base64');
 * </pre>
 * @see File/Driver/Base64
 * @see File/Driver/URL
 */
