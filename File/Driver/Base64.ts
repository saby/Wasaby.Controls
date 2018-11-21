/// <amd-module name='File/Driver/Base64' />
import base64toblob = require('File/utils/b64toBlob');
import BlobDriver = require('File/Driver/Blob');
import Interface = require('File/Driver/Interface');
import detection = require('Core/detection');

const BASE64_PREFIX = (type) => 'data:' + type + ';base64, ';

class Base64Driver implements Interface.FileDriver {
    private base64Data: string;
    private contentType: string;

    /**
     * @param {String} base64string Строка в формате base64
     */
    constructor(base64string: string) {
        if (base64string.indexOf('data:') === -1) {
            this.base64Data = base64string;
            return;
        }
        this.contentType = base64string.substring(base64string.indexOf(':') + 1, base64string.indexOf(';'));
        this.base64Data = base64string.substring(base64string.indexOf(',') + 1);
    }

    /**
     * Начинает загрузку файла
     * @param {FileParams} fileParams Параметры загрузки
     * @returns {Promise<void | Error>} Promise<void | Error>
     */
    public download(fileParams?: Interface.FileParams): Promise<void | Error> {
        const type = (fileParams && fileParams.contentType) ? fileParams.contentType : this.contentType;
        if (typeof window !== 'undefined' && detection.isMobileSafari && detection.IOSVersion >= 12) {
            window.open(BASE64_PREFIX(type) + this.base64Data);
            return;
        }
        if (typeof window !== 'undefined' && detection.safari && detection.IOSVersion >= 12) {
            window.location.href = (BASE64_PREFIX(type) + this.base64Data);
            return;
        }
        let blob: Blob;
        try {
            blob = base64toblob(this.base64Data, type);
        } catch (e) {
            return Promise.reject(new Error(`Ошибка конвертации Base64 строки в Blob!\n${e.message}`));
        }
        return new BlobDriver(Promise.resolve(blob)).download(fileParams);
    }
}
export = Base64Driver;

/**
 * @class File/Driver/Base64
 * @public
 * @author Ибрагимов А.А
 * @description Файловый драйвер для скачивания файлов в кодировке base64
 * <pre>
 * require(['File/Driver/Base64'], function(Base64Driver) {
 *    var base64_text = "wqtXZWVrcyBvZiBjb2RpbmcgY2FuIHNhdmUgeW91IGhvdXJzIG9mIHBsYW5uaW5nwrssDQogdW5rbm93biBhcnRpc3Qu";
 *    new Base64Driver(base64_text).download({
 *       name: 'phrase.txt',          // Имя, под которым файл будет сохранен (необязательно)
 *       contentType: 'text/plain'    // Тип контента (необязательно)
 *     }).catch(console.error);       // обработчик ошибок преобразования
 * });
 * </pre>
 */
