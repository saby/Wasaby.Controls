/// <amd-module name='File/Driver/URL' />
import detection = require('Core/detection');
import FetchAPI = require('Transport/fetch');
import BlobDriver = require('File/Driver/Blob');
import Interface = require('File/Driver/Interface');

class URLDriver implements Interface.FileDriver /** @lends File/Driver/URL */ {

    /** 
     * @param {Strign} url URL файла  
     */
    constructor(private url: string) { }

    public download(fileParams?: Interface.FileParams): Promise<Response | Error> {
        if (detection.isMobilePlatform) {
            window.open(this.url, '_self');
            return;
        }
        return FetchAPI({ url: this.url }).then((res: Response) => {
            new BlobDriver(res.blob()).download(fileParams);
            return res;
        });
    }
}
export = URLDriver;
/**
 * @public
 * @class File/Driver/URL
 * @author Ибрагимов А.А
 * @description Файловый драйвер для скачивания файлов по URL
 * <pre>
 * require(['File/Driver/URL'], function(URLDriver) {
 *    var url_document = "/file-transfer/file.pdf"
 *    new URLDriver(url_document).download();
 * }).catch(console.error);      // обработчик ошибки скачивания
 * </pre>
 */