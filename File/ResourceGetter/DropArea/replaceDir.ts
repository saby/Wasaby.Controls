/// <amd-module name="File/ResourceGetter/DropArea/replaceDir" />
import ParallelDeferred = require("Core/ParallelDeferred");
import Deferred = require("Core/Deferred");

const DROP_FOLDER_ERROR = rk('Загрузка папки не поддерживается браузером');
const UNKNOWN_FILE_TYPE = rk('Неизвестный тип файла');

type DirectoryReader = {
    readEntries(successCallback: (entries: Array<Entry>) => void): void;
}
type Entry = {
    isFile: boolean;
    isDirectory: boolean;
    name: string;
    file(handler: (file: File) => void);
    createReader(): DirectoryReader;
}
type FileWithDir = File & {
    filepath: string;
}

type MultipleArray<T> = Array<T | Array<T>>;

type FileOrError = FileWithDir | Error;
type TravelResult = FileOrError | Array<FileOrError>;

let travel: (entry: Entry, path: string) => Deferred<TravelResult>;
let travelInEntries: (entries: Array<Entry>, path: string) => Deferred<Array<FileOrError>>;

/**
 * Развёртка двумерного массива в одномерный
 * @param {Array<T | Array<T>>} array
 * @return {Array<T>}
 */
let toPlainArray = <T>(array: MultipleArray<T>): Array<T> => {
    return Array.prototype.concat.apply([], array);
};

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
    let deferred = new Deferred<Array<FileOrError>>();
    let dirReader = entry.createReader();
    dirReader.readEntries((entries: Array<Entry>) => {
        deferred.dependOn(travelInEntries(entries, path));
    });
    return deferred;
};

/**
 * Читает Entry
 * @param {Entry} entry
 * @param {string} path Путь до файла
 * @return {Core/Deferred.<File | Error>}
 */
travel = (entry: Entry, path: string): Deferred<TravelResult> => {
    if (entry.isFile) {
        return getFile(entry, path);
    }
    if (entry.isDirectory) {
        return readDirectory(entry, path + entry.name + "/");
    }
    return Deferred.fail(UNKNOWN_FILE_TYPE);
};
/**
 * Обходит содержимое набора из Entry
 * @param {Array.<Entry>} entries
 * @param {string} path Путь до файла
 * @return {Core/Deferred.<Array.<File | Error>>}
 */
travelInEntries = (entries: Array<Entry>, path: string): Deferred<Array<FileOrError>> => {
    let length = entries.length;

    return new ParallelDeferred<TravelResult>({
        steps: entries.map((entry: Entry) => {
            return travel(entry, path)
        }),
        stopOnFirstError: false
    }).done().getResult().addCallback<Array<FileOrError>>((results) => {
        /*
         * results:
         * а) объект с ключами в виде числа
         * б) содержит в себе либо <File | Error> или <Array<File | Error>>
         * Поэтому собираем из него массив и избавляемся от двумерности
         */
        results.length = length;
        return toPlainArray(Array.prototype.slice.call(results))
    });
};
/**
 * Преобразует данные из объекта DataTransferItemList в массив WebKitEntry и запускает рекурсивный обход по ним
 * @param {DataTransferItemList} items
 * @return {Deferred.<Array.<File | Error>>}
 */
let getFromTransferItems = (items: DataTransferItemList): Deferred<Array<File | Error>> => {
    let entries = [];
    let length = items.length;
    for (let i = 0; i < length; i++) {
        entries.push(items[i].webkitGetAsEntry())
    }
    return travelInEntries(entries, "");
};

/**
 * Обходит объект DataTransfer, полученный путём D&D
 * Если среди полученных файлов нету директорий вернёт FileList как есть
 * Иначе проверяет доступность api чтения файлов внутри директории и использует его, добавляя содержимое в выборку,
 * либо заменяет директории на ошибки, что браузер не умеет их грузить
 *
 * @param {DataTransferItemList} items
 * @param {FileList} files
 * @return {Core/Deferred.<FileList | Array.<File | Error>>}
 * @private
 */
let replaceDir = ({items, files}: DataTransfer): Deferred<FileList | Array<File | Error>> => {
    let len = files.length;
    if (!len) {
        return Deferred.success([]);
    }
    let isIncludeDir: boolean;

    for (let i = 0; i< len; i++) {
        let file = files[i];
        if (!file.type) {
            isIncludeDir = true;
            break;
        }
    }
    // Если нету директорий вернём как есть
    if (!isIncludeDir) {
        return Deferred.success(files);
    }
    // Если есть поддержка чтения директорий
    if (items[0].webkitGetAsEntry) {
        return getFromTransferItems(items);
    }
    let result: Array<File | Error> = [];
    for (let i = 0; i< len; i++) {
        let file = files[i];
        // Если просто файл, то вернём как есть
        if (!file.type) {
            result.push(file);
            continue;
        }
        result.push(new Error(DROP_FOLDER_ERROR));
    }
    return Deferred.success(result);
};

export = replaceDir;
