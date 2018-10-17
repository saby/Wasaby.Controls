/// <amd-module name='File/Driver/Blob' />
import Interface = require('File/Driver/Interface');
import detection = require('Core/detection');
/**
 * Файловый драйвер для скачивания Blob файлов
 * @public
 * @class 
 * @implements {File/Driver/Interface}
 * @author Ибрагимов А.А
 */
class BlobDriver implements Interface.FileDriver {
    private name: string = 'no_name_blob';

    constructor(private promiseBlob: Promise<Blob>) { }

    public download(fileParams?: Interface.FileParams): Promise<void | Error> {
        return this.promiseBlob.then(blob => this._downloadBlob(blob, fileParams));
    }

    private _downloadBlob(blob: Blob, options: { [name: string]: string }): void | Error {
        let name: string = (options) ? options['name'] : this.name;
        if (detection.isIE) {
            window.navigator.msSaveOrOpenBlob(blob, name);
            return;
        }
        const url: string = URL.createObjectURL(blob);
        const link: HTMLAnchorElement = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link).click();
        URL.revokeObjectURL(url);
    }
}
export = BlobDriver;
