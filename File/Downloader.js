define("File/Downloader", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Инициализирует загрузку файла
     * @param {string} entity URL документа, либо Base64-строка
     * @param {FileParams} [fileParams] name - имя файла, contentType - тип файла
     * @param {DRIVERS_NAMES} [driverName] Имя драйвера для работы с данным типом фалйла (см Downloader.DRIVERS_NAMES)
     */
    function Downloader(entity, fileParams, driverName) {
        if (!entity) {
            throw new Error("Некорректный аргумент entity: " + typeof entity);
        }
        return new Promise(function (resolve) { return require([driverName || DetectDriverName(entity)], function (Driver) {
            resolve(new Driver(entity).download(fileParams));
        }); });
    }
    /**
     * Детектирует переданный аргумент и возвращает соответствующий для работы драйвер
     * @param {string} entity  URL документа, либо Base64-строка
     * @return {DRIVERS_NAMES} driverName Имя драйвера для работы с данным типом фалйла (см Downloader.DRIVERS_NAMES)
     */
    function DetectDriverName(entity) {
        if (entity.indexOf('https://') !== -1 || entity.indexOf('?') !== -1 || entity.indexOf('&') !== -1) {
            return DRIVERS_NAMES.URL;
        }
        return DRIVERS_NAMES.Base64;
    }
    /**
     *  @name File/Downloader#DRIVERS_NAMES
     *  Имена драйверов для работы с файлами
     *  @typedef {DRIVERS_NAMES}
    */
    var DRIVERS_NAMES;
    (function (DRIVERS_NAMES) {
        DRIVERS_NAMES["URL"] = "File/Driver/URL";
        DRIVERS_NAMES["Base64"] = "File/Driver/Base64";
    })(DRIVERS_NAMES || (DRIVERS_NAMES = {}));
    Downloader['DRIVERS_NAMES'] = DRIVERS_NAMES;
    return Downloader;
});
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
 * <p> Возвращаемое значение:
 * <ul>
 *      <li> В случае скачивания Base64 строки возвращает Promise<void | Error> </li>
 *      <li> В случае скачивания URL адреса возвращает Promise<Response| void | Error> </li>
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
 *         name: 'phrase.txt',              // Имя, под которым файл будет сохранен (необязательно)
 *         contentType: 'text/plain'        // Тип контента (необязательно)
 *     }, Downloader.DRIVERS_NAMES.Base64)  // Имя файлового драйвера, явно указывает какого типа файл требуется скачать (необязательно)
 *    .catch(console.error);                // Обработчик ошибки скачивания
 *
 *
 *    // Скачивание документа по URL
 *    Downloader("https://bad_url").then(parseResponse).catch(console.error);
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
 * @typedef  {Object} FileParams
 * @property {String} name  Имя, под которым файл будет сохранен (необязательно)
 * @property {String} contentType Тип файла
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
