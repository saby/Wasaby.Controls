/// <amd-module name="File/utils/getFilePreparer" />
import LocalFile = require("File/LocalFile");
import filter = require("File/utils/filter");

/**
 * Функцию преподготовки файлов, которая пробежиться по набору "сырых" файлов,
 * отфильтрует их по заданным параметрам и обернёт в {@link File/LocalFile}
 * @type {function(selectedFiles: FileList | Array.<Blob>): Array.<File/LocalFile | Error>}
 * @name FilePreparer
 */

/**
 * Возвращает функцию преподготовки файлов, которая пробежиться по набору "сырых" файлов,
 * отфильтрует их по заданным параметрам и обернёт в {@link File/LocalFile}
 * @function
 * @param {Object} FilterParam Параметры фильтрации
 * @return {FilePreparer}
 * @public
 * @author Заляев А.В.
 * @name File/utils/getFilePreparer
 * @see File/utils/filter
 * @see File/LocalFile
 */
export = (filterParams) => (selectedFiles: FileList) => filter(selectedFiles, filterParams).map(
    (file) => {
        if (file instanceof Error){
            return file;
        }
        return new LocalFile(file);
    }
)
