define("File/utils/filter", ["require", "exports", "File/Error/Extension", "File/Error/MaxSize", "File/LocalFile", "File/Directory"], function (require, exports, ExtensionsError, MaxSizeError, LocalFile, Directory) {
    "use strict";
    var KB = 1024;
    var MB = KB * KB;
    return function (fileList, _a) {
        var extensions = _a.extensions, _b = _a.maxSize, maxSize = _b === void 0 ? 0 : _b;
        var results = [];
        maxSize = maxSize * MB;
        /*
         * Нельзя обходить FileList через "for in" + ".hasOwnProperty"
         * https://w3c.github.io/FileAPI/#filelist-section
         * Обход надо делать только по числовому индексу и получать через FileList.item({Number}) или FileList[{Number}]
         */
        for (var i = 0; i < fileList.length; i++) {
            var item = fileList instanceof FileList ?
                fileList.item(i) :
                fileList[i];
            // Если пришла уже ошибка из внутренней фильтрации ResourceGetter
            if ((item instanceof Error) ||
                (item instanceof Directory)) {
                results.push(item);
                continue;
            }
            var isLocalFile = void 0;
            var file = void 0;
            if (item instanceof LocalFile) {
                file = item.getData();
                isLocalFile = true;
            }
            else {
                file = item;
            }
            // По типу
            if (extensions && !extensions.verify(file)) {
                results.push(new ExtensionsError({
                    fileName: file.name,
                    extensions: extensions.toString()
                }));
                continue;
            }
            // По размеру
            if (maxSize && (file.size > maxSize)) {
                results.push(new MaxSizeError({
                    fileName: file.name,
                    maxSize: maxSize
                }));
                continue;
            }
            results.push(isLocalFile ? item : new LocalFile(file));
        }
        return results;
    };
});
