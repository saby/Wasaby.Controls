/// <amd-module name='File/Driver/Blob' />
import detection = require('Core/detection');
import { FileDriver, FileParams } from 'File/Driver/Interface';

class BlobDriver implements FileDriver {
    private name: string = 'no_name_blob';

    constructor(private promiseBlob: Promise<Blob>) { }

    public download(fileParams?: FileParams): Promise<void | Error> {
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
