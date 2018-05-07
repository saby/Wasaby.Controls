define("File/utils/getFilePreparer", ["require", "exports", "File/LocalFile", "File/utils/filter"], function (require, exports, LocalFile, filter) {
    "use strict";
    return function (filterParams) { return function (selectedFiles) { return filter(selectedFiles, filterParams).map(function (file) {
        if (file instanceof Error) {
            return file;
        }
        return new LocalFile(file);
    }); }; };
});
