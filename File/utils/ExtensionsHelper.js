/// <amd-module name="File/utils/ExtensionsHelper" />
define("File/utils/ExtensionsHelper", ["require", "exports", "json!File/utils/MimeTypes", "json!File/utils/MediaTypes"], function (require, exports, MimeTypes, MediaTypes) {
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
            if (!this.extensions.length) {
                return true;
            }
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
        ExtensionsHelper.prototype.toString = function () {
            return this.rawExtensions.join(", ");
        };
        return ExtensionsHelper;
    }());
    return ExtensionsHelper;
});
