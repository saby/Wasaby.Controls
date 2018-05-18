define("File/ResourceGetter/DropArea/replaceDir", ["require", "exports", "Core/ParallelDeferred", "Core/Deferred", "File/Error/UnknownType", "File/Error/UploadFolder"], function (require, exports, ParallelDeferred, Deferred, UnknownTypeError, UploadFolderError) {
    "use strict";
    /**
     * Развёртка двумерного массива в одномерный
     * @param {Array<T | Array<T>>} array
     * @return {Array<T>}
     */
    var toPlainArray = function (array) {
        return Array.prototype.concat.apply([], array);
    };
    var getParallelDeferred = function (steps) {
        var length = steps.length;
        return new ParallelDeferred({
            steps: steps,
            stopOnFirstError: false
        }).done().getResult().addCallback(function (results) {
            results.length = length;
            return Array.prototype.slice.call(results);
        });
    };
    /// region File Entry
    var readEntries;
    /**
     * Читает и возвращает файл из Entry, добавляя ему относиттельный путь
     * @param {Entry} entry
     * @param {String} path Путь до файла
     * @return {Core/Deferred.<FileWithDir>}
     */
    var getFile = function (entry, path) {
        var deferred = new Deferred();
        entry.file(function (file) {
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
    var readDirectory = function (entry, path) {
        var deferred = new Deferred();
        var dirReader = entry.createReader();
        dirReader.readEntries(function (entries) {
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
    var readEntry = function (entry, path) {
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
    readEntries = function (entries, path) {
        return getParallelDeferred(entries.map(function (entry) {
            return readEntry(entry, path);
        })).addCallback(function (results) {
            // избавляемся от двумерности
            return toPlainArray(results);
        });
    };
    /**
     * Преобразует данные из объекта DataTransferItemList в массив WebKitEntry и запускает рекурсивный обход по ним
     * @param {DataTransferItemList} items
     * @return {Deferred.<Array.<File | Error>>}
     */
    var getFromEntries = function (items) {
        /*
         * При перемещении файла в DataTransfer.items могут оказаться "лишние" элементы
         * если например переносить .url файл
         * dataTransfer.items для него будет выглядить примерно так:
         * [{kind: 'string', type: 'text/plain'}, {kind: 'string', type: 'text/uri-list'}, {kind: 'file', type: '}]
         */
        var entries = Array.prototype.filter.call(items, function (item) {
            return item.kind == 'file';
        }).map(function (item) {
            return item.webkitGetAsEntry();
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
    var getReader = function (deferred) {
        var releaseReader = function (reader) {
            reader.onprogress = reader.onerror = null;
        };
        var reader = new FileReader();
        reader.onprogress = function () {
            reader.abort(); // Читать весь файл не нужно.
            deferred.callback();
            releaseReader(reader);
        };
        reader.onerror = function () {
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
    var getFromFileReader = function (files) {
        var steps = Array.prototype.map.call(files, function (file) {
            var deferred = new Deferred();
            deferred.addCallbacks(function () {
                return file;
            }, function () {
                return new UploadFolderError({
                    fileName: file.name
                });
            });
            var reader = getReader(deferred);
            try {
                reader.readAsArrayBuffer(file);
            }
            catch (error) {
                reader.onerror(error);
            }
            return deferred;
        });
        return getParallelDeferred(steps);
    };
    /// endregion FileReader
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
    var replaceDir = function (_a) {
        var items = _a.items, files = _a.files;
        var len = files.length;
        if (!len) {
            return Deferred.success([]);
        }
        var isIncludeUnknownType;
        for (var i = 0; i < len; i++) {
            var file = files[i];
            if (!file.type) {
                isIncludeUnknownType = true;
                break;
            }
        }
        // Если нету директорий вернём как есть
        if (!isIncludeUnknownType) {
            return Deferred.success(files);
        }
        // Если есть поддержка чтения директорий
        if (items[0].webkitGetAsEntry) {
            return getFromEntries(items);
        }
        // Читать директории не можем, но можем определить файлы без типов
        if (typeof FileReader !== 'undefined') {
            return getFromFileReader(files);
        }
        // Не можем определить где директория, где просто отсуствует тип, заменяем на ошибку
        return Deferred.success(Array.prototype.map.call(files, function (file) {
            if (!file.type) {
                return new UploadFolderError({
                    fileName: file.name
                });
            }
            return file;
        }));
    };
    return replaceDir;
});
