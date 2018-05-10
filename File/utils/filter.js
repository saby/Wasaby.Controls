define("File/utils/filter", ["require", "exports", "File/Error/Extension", "File/Error/MaxSize"], function (require, exports, ExtensionsError, MaxSizeError) {
    "use strict";
    var KB = 1024;
    var MB = KB * KB;
    return function (fileList, _a) {
        var extensions = _a.extensions, _b = _a.maxSize, maxSize = _b === void 0 ? 0 : _b;
        var files = [];
        maxSize = maxSize * MB;
        /*
         * Нельзя обходить FileList через "for in" + ".hasOwnProperty"
         * https://w3c.github.io/FileAPI/#filelist-section
         * Обход надо делать только по числовому индексу и получать через FileList.item({Number}) или FileList[{Number}]
         */
        for (var i = 0; i < fileList.length; i++) {
            var file = fileList instanceof FileList ? fileList.item(i) : fileList[i];
            // По типу
            if (extensions && !extensions.verify(file)) {
                files.push(new ExtensionsError({
                    fileName: file.name,
                    extensions: extensions.toString()
                }));
                continue;
            }
            // По размеру
            if (maxSize && (file.size > maxSize)) {
                files.push(new MaxSizeError({
                    fileName: file.name,
                    maxSize: maxSize
                }));
                continue;
            }
            files.push(file);
        }
        return files;
    };
});
