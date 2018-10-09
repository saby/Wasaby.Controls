/// <amd-module name="File/utils/ExtensionsHelper" />

import MimeTypes = require("json!File/utils/MimeTypes");
import MediaTypes = require("json!File/utils/MediaTypes");

let isMediaType = (type: string) => {
    return (type == 'audio' || type == 'video' || type == 'image') || false;
};
class ExtensionsHelper {
    // Исходный набор расширений, нужен для формирования более короткой строки MIME-type
    private rawExtensions: Array<string>;
    // Преобразованный набор, где audio, video, image будут заменены на соответствующие наборы расширений
    private extensions: Array<string> = [];
    constructor(extensions?: Array<string>) {
        extensions = extensions || [];
        this.rawExtensions = extensions;
        extensions.forEach((ext: string) => {
            if (isMediaType(ext)){
                this.extensions = this.extensions.concat(MediaTypes[ext])
            } else {
                this.extensions.push(ext);
            }
        });
    }

    /**
     * Проверяет файл на валидность расширения из заданного набора
     * @param {File} file
     * @returns {Boolean}
     */
    verify(file: File): boolean {
        if (!this.extensions.length) {
            return true;
        }
        let fileExt = ((file.name.match(/^\S[\S\s]*\.([\S]+)$/) || [])[1] || "").toLowerCase();
        if (this.extensions.indexOf(fileExt) > -1) {
            return true;
        }

        let type = file.type;
        if (!type) {
            return false;
        }
        for (let key in MimeTypes) {
            if (MimeTypes.hasOwnProperty(key) &&
                MimeTypes[key] === type &&
                this.extensions.indexOf(key) != -1
            ) {
                return true;
            }
        }
        return false;
    }
    /**
     * Формирует строку mime-types
     * @returns {String}
     */
    getMimeString(): string {
        let mediaTypes = [];
        let existsMimes = [];
        let unregistered = [];

        this.rawExtensions.forEach((ext) => {
            if (isMediaType(ext)) {
                return mediaTypes.push(ext);
            }
            if (ext in MimeTypes) {
                return existsMimes.push(ext);
            }
            unregistered.push(ext)
        });
        /**
         * Если имеем расширения, для которых не нашли MIME тип в таблице, то
         * такие расширения в итоговой строке надо указать как .расширение
         * Но нельзя в accept комбинировать строку из MIME типов и расширений
         * поэтому берём склеиваем итоговую строку из указанных расширений и расширения, соответствующие медиа типам,
         * если они указаны
         */
        if (unregistered.length) {
            return this.extensions.map(ext => ("." + ext)).join(",");
        }
        /**
         * Если все указаные расширения покрываются таблицей MIME типов,
         * то просто клеим их с медиа типами, если они указаны
         */
        return [].concat(
            existsMimes.map(ext => MimeTypes[ext]),
            mediaTypes.map(ext => (ext + '/*'))
        ).join(",");
    }
    toString(): string {
        return  this.rawExtensions.join(", ");
    }
}
export = ExtensionsHelper;
