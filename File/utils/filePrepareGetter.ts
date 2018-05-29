/// <amd-module name="File/utils/filePrepareGetter" />
import LocalFile = require("File/LocalFile");
import filter = require("File/utils/filter");

type FilePreparer = (selectedFiles: FileList | Array<Blob>) => Array<LocalFile | Error>
type FilePrepareGetter = (filterParams: object) => FilePreparer;

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
let filePrepareGetter: FilePrepareGetter;

filePrepareGetter = (filterParams: object) => { // FilePrepareGetter
    return (files: FileList) => { // FilePreparer
        return filter(files, filterParams).map(
            (file) => {
                if (file instanceof Error) {
                    return file;
                }
                return new LocalFile(file);
            }
        );
    }
};
export = filePrepareGetter;
