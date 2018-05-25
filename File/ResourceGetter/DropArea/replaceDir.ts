/// <amd-module name="File/ResourceGetter/DropArea/replaceDir" />
import ParallelDeferred = require("Core/ParallelDeferred");
import Deferred = require("Core/Deferred");
import UnknownTypeError = require("File/Error/UnknownType");
import UploadFolderError = require("File/Error/UploadFolder");

type DirectoryReader = {
    readEntries(successCallback: (entries: Array<Entry>) => void): void;
}
type Entry = null | {
    isFile: boolean;
    isDirectory: boolean;
    name: string;
    file(handler: (file: File) => void);
    createReader(): DirectoryReader;
}
type FileWithDir = File & {
    filepath?: string;
}

type MultipleArray<T> = Array<T | Array<T>>;

type Resource = FileWithDir | Error;
type Resources = Array<Resource>

/**
 * Развёртка двумерного массива в одномерный
 * @param {Array<T | Array<T>>} array
 * @return {Array<T>}
 */
let toPlainArray = <T>(array: MultipleArray<T>): Array<T> => {
    return Array.prototype.concat.apply([], array);
};

let getParallelDeferred = <T>(steps): Deferred<Array<T>> => {
    let length = steps.length;
    return new ParallelDeferred<T>({
        steps,
        stopOnFirstError: false
    }).done().getResult().addCallback<Array<T>>((results) => {
        results.length = length;
        return Array.prototype.slice.call(results)
    });
};

/// region File Entry

let readEntries: (entries: Array<Entry>, path: string) => Deferred<Resources>;

/**
 * Читает и возвращает файл из Entry, добавляя ему относиттельный путь
 * @param {Entry} entry
 * @param {String} path Путь до файла
 * @return {Core/Deferred.<FileWithDir>}
 */
let getFile = (entry: Entry, path: string): Deferred<FileWithDir> => {
    let deferred = new Deferred<FileWithDir>();
    entry.file((file: FileWithDir) => {
        file.filepath = path + file.name; // save full path
        deferred.callback(file);
    });
    return deferred;
};
/**
 * Читает содержимое директории Entry и запускает рекурсивный обход по ним
 * @param {Entry} entry
 * @param {String} path Путь до файла
 * @return {Core/Deferred.<Array.<File | Error>>}
 */
let readDirectory = (entry: Entry, path: string) => {
    let deferred = new Deferred<Resources>();
    let dirReader = entry.createReader();
    dirReader.readEntries((entries: Array<Entry>) => {
        deferred.dependOn(readEntries(entries, path));
    });
    return deferred;
};

/**
 * Читает Entry
 * @param {Entry} entry
 * @param {string} path Путь до файла
 * @return {Core/Deferred.<File | Error>}
 */
let readEntry = (entry: Entry, path: string): Deferred<Resource | Resources> => {
    if (!entry) {
        return Deferred.fail(new UnknownTypeError({
            fileName: path + ""
        }));
    }
    if (entry.isFile) {
        return getFile(entry, path);
    }
    if (entry.isDirectory) {
        return readDirectory(entry, path + entry.name + "/");
    }
};
/**
 * Обходит содержимое набора из Entry
 * @param {Array.<Entry>} entries
 * @param {string} path Путь до файла
 * @return {Core/Deferred.<Array.<File | Error>>}
 */
readEntries = (entries: Array<Entry>, path: string): Deferred<Resources> => {
    return getParallelDeferred<Resource | Resources>(
        entries.map((entry: Entry) => {
            return readEntry(entry, path)
        })
    ).addCallback<Resources>((results) => {
        // избавляемся от двумерности
        return toPlainArray(results)
    });
};

/**
 * Преобразует данные из объекта DataTransferItemList в массив WebKitEntry и запускает рекурсивный обход по ним
 * @param {DataTransferItemList} items
 * @return {Deferred.<Array.<File | Error>>}
 */
let getFromEntries = (items: DataTransferItemList): Deferred<Resources> => {
    /*
     * При перемещении файла в DataTransfer.items могут оказаться "лишние" элементы
     * если например переносить .url файл
     * dataTransfer.items для него будет выглядить примерно так:
     * [{kind: 'string', type: 'text/plain'}, {kind: 'string', type: 'text/uri-list'}, {kind: 'file', type: '}]
     */
    let entries = Array.prototype.filter.call(items, (item) => {
        return item.kind == 'file'
    }).map(item => {
        return item.webkitGetAsEntry()
    });
    return readEntries(entries, "");
};

/// endregion File Entry

/// region FileReader
/**
 * Возвращает экземпляр FileReader, привязанный к Deferred'у для попытки чтения файла
 * @param {Core/Deferred} deferred
 * @return {FileReader}
 */
let getReader = (deferred: Deferred<void>): FileReader => {
    let releaseReader = (reader: FileReader) => {
        reader.onprogress = reader.onerror = null;
    };
    let reader = new FileReader();
    reader.onprogress = () => {
        reader.abort(); // Читать весь файл не нужно.
        deferred.callback();
        releaseReader(reader);
    };
    reader.onerror = () => {
        deferred.errback();
        releaseReader(reader);
    };
    return reader;
};

/**
 * Преобразование помощью FileReader
 * Если попали сюда, значит папку мы уже не загрузим никак, поэтому
 * Чтение через FileReader падает с ошибкой, если передать ему директорию на них вернём ошибку,
 * остальные непонятные файлы без типов отдадим на загрузку
 *
 * @param {FileList} files
 * @return {Core/Deferred.<FileList | Array.<File | Error>>}
 */
let getFromFileReader = (files: FileList): Deferred<Resources> => {
    let steps = Array.prototype.map.call(files, (file: File) => {
        let deferred = new Deferred<void>();
        deferred.addCallbacks<Resource>(() => {
            return file;
        }, () => {
            return new UploadFolderError({
                fileName: file.name
            })
        });

        let reader = getReader(deferred);
        try {
            reader.readAsArrayBuffer(file);
        } catch (error) {
            reader.onerror(error);
        }

        return deferred;
    });

    return getParallelDeferred<Resource>(steps);
};
/// endregion FileReader

/**
 * Т.к. нету нормальной возможности грузить директории на сервис, но есть возможность получать их через D&D
 * Надо обойти полученный FileList на наличие "непонятных" файлов, у которых нету типа
 * 1) Если таковых нет, то ввозвращаем исходный FileList без изменений
 * 2) Иначе, по возможности, получаем File-Entry соответствующий полученному файлу
 * из него уже можно точно сказать директория это или нет и прочитать рекурсивно содержиое вложенных директорий
 * и склеив содержимое в итоговую выборку, пометив каждый полученный файл путём до него относительно
 * первой переданной директории
 * 3) Если такой возможности нет, то через FileReader пытаемся понять, файл это или директория,
 * и заменяем директории на ошибки, что не браузер умеет их грузить
 * 4) Либо же заменяем все "непонятнын" файлы на ошибки, чтобы ничего не обвалить при загрузке
 *
 * @param {DataTransferItemList} items
 * @param {FileList} files
 * @return {Core/Deferred.<FileList | Array.<File | Error>>}
 * @private
 */
let replaceDir = ({items, files}: DataTransfer): Deferred<FileList | Resources> => {
    // dnd папки в IE стрельнёт событием, но не даст файлов
    let len = files.length;
    if (!len) {
        return Deferred.success([]);
    }

    let isIncludeUnknownType: boolean;
    for (let i = 0; i < len; i++) {
        let file = files[i];
        if (!file.type) {
            isIncludeUnknownType = true;
            break;
        }
    }
    // Если нету файлов с неизвестным типом, то вернём как есть
    if (!isIncludeUnknownType) {
        return Deferred.success(files);
    }

    /*
     * Если есть поддержка чтения директорий через DataTransferItem.[webkit]GetAsEntry
     * наличие DataTransferItemList, или его заполненость, так же не гарантируется
     */
    if (items && items[0] && items[0].webkitGetAsEntry) {
        return getFromEntries(items);
    }

    // Читать директории не можем, но можем определить файлы без типов
    if (typeof FileReader !== 'undefined') {
        return getFromFileReader(files);
    }

    // Не можем определить где директория, где просто отсуствует тип, заменяем на ошибку
    return Deferred.success(Array.prototype.map.call(files, file => {
        if (!file.type) {
            return new UploadFolderError({
                fileName: file.name
            });
        }
        return file;
    }))
};

export = replaceDir;
