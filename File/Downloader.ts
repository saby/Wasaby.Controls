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
 * @description 
 * <h4>File/Downloader применяется для скачивания файлов в кодировке Base64 и документов, доступных по URL.</h4>
 * <p>В качестве опций получает:
 * <ul>
 *    <li><b>{@link File/Downloader#entity entity}</b> - сущность для скачивания - закодированная в base64 строка, либо URL документа</li>
 *    <li>(необязательно) <b>{@link File/Downloader#fileParams fileParams}</b> - объект параметров загружаемого файла (только для base64). </li>
 *    <li>(необязательно) <b>{@link File/Downloader#fileDriver fileDriver}</b> - файловый драйвер, передается, чтобы явно указать тип загружаемого файла.</br>
 *      <p><i>Если файловый драйвер не передан, File/Downloader пытается сам определить файл, и выбрать соответствующий способ скачивания.</i></p>
 *      <p>Имена файловых драйверов доступны в <b>Downloader.DRIVERS_NAMES</b></p>
 *      <p>Используте константы вместо строковых значений:
 *       <ul>
 *          <li>Downloader.DRIVERS_NAMES.Base64 вместо {@link File/Driver/Base64  'File/Driver/Base64'}</li>
 *          <li>Downloader.DRIVERS_NAMES.URL вместо {@link File/Driver/URL 'File/Driver/URL'}</li>
 *       </ul>
 *    </li>
 * </ul>
 * </p>
 * <b>Пример использования</b>
 * <pre>
 * require(['File/Downloader'], function(Downloader) {
 * 
 *    // Скачивание base64 файла  
 *    var base64_text = "wqtXZWVrcyBvZiBjb2RpbmcgY2FuIHNhdmUgeW91IGhvdXJzIG9mIHBsYW5uaW5nwrssDQogdW5rbm93biBhcnRpc3Qu";
 *    
 *    Downloader(base64_text, {
 *         name: 'phrase.txt',         // Имя, под которым файл будет сохранен (необязательно)
 *         contentType: 'text/plain'   // Тип контента (необязательно)
 *     }, Downloader.DRIVERS_NAMES.Base64);       // Имя файлового драйвера, явно указывает какого типа файл требуется скачать (необязательно)
 * 
 * 
 *    // Скачивание документа по URL
 *    Downloader("/file-transfer/file.pdf"); 
 * });
 * </pre>
 *  @see File/Driver/Base64
 *  @see File/Driver/URL
 */

/**
 * @name File/Downloader#entity
 * @cfg {Entity} URL документа, либо файл в кодировке Base64 
 */
/** 
 * @typedef {String} Entity URL документа, либо файл в кодировке Base64 
 * Пример: загрузка документа из FileTransfer
 * <pre class="brush:js">
 *    Downloader("/file-transfer/file.pdf");
 * </pre>
 */

/**
 * @name File/Downloader#fileParams
 * @cfg {FileParams} Параметры скачиваемого файла
 */
/** 
 * @typedef {Object} FileParams
 * @property {String} name  Имя, под которым файл будет сохранен (необязательно)
 * @property {String} contentType Тип файла 
 * <i>Игнорируется при загрузке URL</i>
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
 * @name File/Downloader#fileDriver
 * @cfg {FileDriver} Имя файлового драйвера, явно указывает тип скачиваемого файла (File/Downloader пытается сам определить тип загружаемого файла, однако желательно явно определить драйвер для работы со скачиваемым файлом)
 */
/** 
 * @typedef {String} FileDriver 
 * @variant Downloader.DRIVERS_NAMES.Base64
 * @variant Downloader.DRIVERS_NAMES.URL
 * File/Downloader пытается сам определить тип загружаемого файла, однако желательно явно определить драйвер для работы со скачиваемым файлом.
 * Пример: явное указание FileDriver'a
 * <pre class="brush:js">
 *    Downloader('/file-transfer/file.pdf', {}, Downloader.DRIVERS_NAMES.URL);
 * </pre>
 */