/// <amd-module name="File/utils/ExtensionsHelper" />
define("File/utils/ExtensionsHelper", ["require", "exports", "json!File/utils/MimeTypes", "json!File/utils/MediaTypes", "File/LocalFile", "File/utils/ExtensionsError"], function (require, exports, MimeTypes, MediaTypes, LocalFile, ExtensionsError) {
    "use strict";
    var isMediaType = function (type) {
        return (type == 'audio' || type == 'video' || type == 'image') || false;
    };
    var ExtensionsHelper = /** @class */ (function () {
        function ExtensionsHelper(extensions) {
            var _this = this;
            // Преобразованный набор, где audio, video, image будут заменены на соответствующие наборы расширений
            this.extensions = [];
            extensions = extensions || [];
            this.rawExtensions = extensions;
            extensions.forEach(function (ext) {
                if (isMediaType(ext)) {
                    _this.extensions = _this.extensions.concat(MediaTypes[ext]);
                }
                else {
                    _this.extensions.push(ext);
                }
            });
        }
        /**
         * Проверяет файл на валидность расширения из заданного набора
         * @param {File} file
         * @returns {Boolean}
         */
        ExtensionsHelper.prototype.verify = function (file) {
            var fileExt = ((file.name.match(/^\S[\S\s]*\.([\S]+)$/) || [])[1] || "").toLowerCase();
            if (this.extensions.indexOf(fileExt) > -1) {
                return true;
            }
            var type = file.type;
            if (!type) {
                return false;
            }
            for (var key in MimeTypes) {
                if (MimeTypes.hasOwnProperty(key) &&
                    MimeTypes[key] === type &&
                    this.extensions.indexOf(key) != -1) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Проверяет валидность файлов переданного FileList и заменяет их на {@link File/LocalFile} либо на объект ошибки
         * @param {FileList | Array.<File | Error>} fileList
         * @return {Array.<LocalFile | Error>} Массив обёрток над локальными файлами или ошибок
         */
        ExtensionsHelper.prototype.verifyAndReplace = function (fileList) {
            var files = [];
            /*
             * Нельзя обходить FileList через "for in" + ".hasOwnProperty"
             * https://w3c.github.io/FileAPI/#filelist-section
             * Обход надо делать только по числовому индексу и получать через FileList.item({Number}) или FileList[{Number}]
             */
            for (var i = 0; i < fileList.length; i++) {
                var error = void 0;
                var file = fileList instanceof FileList ? fileList.item(i) : fileList[i];
                if (file instanceof Error) {
                    files.push(file);
                    continue;
                }
                if (this.extensions.length && !this.verify(file)) {
                    error = new ExtensionsError(file.name);
                }
                files.push(error || new LocalFile(file));
            }
            return files;
        };
        /**
         * Формирует строку mime-types
         * @returns {String}
         */
        ExtensionsHelper.prototype.getMimeString = function () {
            var mediaTypes = [];
            var existsMimes = [];
            var unregistered = [];
            this.rawExtensions.forEach(function (ext) {
                if (isMediaType(ext)) {
                    return mediaTypes.push(ext);
                }
                if (ext in MimeTypes) {
                    return existsMimes.push(ext);
                }
                unregistered.push(ext);
            });
            /**
             * Если имеем расширения, для которых не нашли MIME тип в таблице, то
             * такие расширения в итоговой строке надо указать как .расширение
             * Но нельзя в accept комбинировать строку из MIME типов и расширений
             * поэтому берём склеиваем итоговую строку из указанных расширений и расширения, соответствующие медиа типам,
             * если они указаны
             */
            if (unregistered.length) {
                return this.extensions.map(function (ext) { return ("." + ext); }).join(",");
            }
            /**
             * Если все указаные расширения покрываются таблицей MIME типов,
             * то просто клеим их с медиа типами, если они указаны
             */
            return [].concat(existsMimes.map(function (ext) { return MimeTypes[ext]; }), mediaTypes.map(function (ext) { return (ext + '/*'); })).join(",");
        };
        return ExtensionsHelper;
    }());
    return ExtensionsHelper;
});
