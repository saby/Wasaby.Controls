/// <amd-module name="File/utils/b64toBlob" />

let b64toBlob: (data: string, contentType: string, sliceSize?: number) => Blob;
/**
 * Получение файла из base64 строки
 * @param {String} data Тело файла в виде base64 строки
 * @param {String} contentType MIME-type
 * @param {Number} [sliceSize]
 * @return {File}
 */
b64toBlob = (data: string, contentType: string, sliceSize?: number): Blob => {
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {
        type: contentType || ""
    });
};

if ((typeof Blob === "undefined") || (typeof Uint8Array === "undefined")) {
    b64toBlob = (data: string, contentType: string, sliceSize?: number) => {
        throw new Error("Function is not supported is current platform");
    }
}

export = b64toBlob;
