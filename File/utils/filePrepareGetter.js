define("File/utils/filePrepareGetter", ["require", "exports", "File/LocalFile", "File/utils/filter"], function (require, exports, LocalFile, filter) {
    "use strict";
    /**
     * Функцию преподготовки файлов, которая пробежиться по набору "сырых" файлов,
     * отфильтрует их по заданным параметрам и обернёт в {@link File/LocalFile}
     * @type {Function}
     * @param {FileList | Array.<Blob>} files Набор файлов, необходимых для фильтрации и преобразования
     * @return Array.<File/LocalFile | Error>
     * @name FilePreparer
     */
    /**
     * Возвращает функцию преподготовки файлов, которая пробежиться по набору "сырых" файлов,
     * отфильтрует их по заданным параметрам и обернёт в {@link File/LocalFile}
     * @function
     * @param {Object} filterParams Параметры фильтрации
     * @return {FilePreparer} Функция фильтрации и преобразования в File/LocalFile
     * @public
     * @author Заляев А.В.
     * @name File/utils/getFilePreparer
     * @see File/utils/filter
     * @see File/LocalFile
     */
    var filePrepareGetter;
    filePrepareGetter = function (filterParams) {
        return function (files) {
            return filter(files, filterParams).map(function (file) {
                if (file instanceof Error) {
                    return file;
                }
                return new LocalFile(file);
            });
        };
    };
    return filePrepareGetter;
});
