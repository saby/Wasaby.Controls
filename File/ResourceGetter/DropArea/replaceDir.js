define("File/ResourceGetter/DropArea/replaceDir", ["require", "exports", "Core/ParallelDeferred", "Core/Deferred", "File/Error/UnknownType", "File/Error/UploadFolder", "File/LocalFile", "File/Directory"], function (require, exports, ParallelDeferred, Deferred, UnknownTypeError, UploadFolderError, LocalFile, Directory) {
    "use strict";
    var getParallelDeferred = function (steps) {
        var length = steps.length;
        return new ParallelDeferred({
            steps: steps,
            stopOnFirstError: false,
            /*
             * Очередь чтения
             * чтобы не создавать сразу десятки/сотки обращений в файловой системе при чтении папки
             */
            maxRunningCount: 5
        }).done().getResult().addCallback(function (results) {
            results.length = length;
            return Array.prototype.slice.call(results);
        });
    };
    var readEntries;
    /**
     * Читает файл из Entry
     * @return {Core/Deferred}
     */
    var getFile = function (_a) {
        var results = _a.results, entry = _a.entry, root = _a.root;
        var deferred = new Deferred();
        entry.file(function (file) {
            var localFile = new LocalFile(file);
            if (root) {
                root.push(localFile);
            }
            else {
                results.push(localFile);
            }
            deferred.callback();
        });
        return deferred;
    };
    /**
     * Читает содержимое директории Entry и запускает рекурсивный обход по ним
     */
    var readDirectory = function (_a) {
        var results = _a.results, entry = _a.entry, root = _a.root;
        var deferred = new Deferred();
        var dirReader = entry.createReader();
        dirReader.readEntries(function (entries) {
            deferred.dependOn(readEntries({ results: results, entries: entries, root: root }));
        });
        return deferred;
    };
    /**
     * Читает Entry
     */
    var readEntry = function (_a) {
        var results = _a.results, entry = _a.entry, root = _a.root;
        if (!entry) {
            return Deferred.fail(new UnknownTypeError({
                fileName: root ? root.getName() : ''
            }));
        }
        if (entry.isFile) {
            return getFile({ results: results, entry: entry, root: root });
        }
        if (entry.isDirectory) {
            var folder = new Directory({
                name: entry.name
            });
            if (root) {
                root.push(folder);
            }
            else {
                results.push(folder);
            }
            return readDirectory({
                entry: entry,
                root: folder,
                results: results
            });
        }
    };
    /**
     * Обходит содержимое набора из Entry
     * @return {Core/Deferred.<Array.<File | Error>>}
     */
    readEntries = function (_a) {
        var results = _a.results, entries = _a.entries, root = _a.root;
        return getParallelDeferred(entries.map(function (entry) {
            return readEntry({ results: results, entry: entry, root: root });
        }));
    };
    /**
     * Преобразует данные из объекта DataTransferItemList в массив WebKitEntry и запускает рекурсивный обход по ним
     * @param {DataTransferItemList} items
     * @return {Deferred.<Array.<File | Error>>}
     */
    var getFromEntries = function (items) {
        var results = [];
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
        return readEntries({ results: results, entries: entries }).addCallback(function () {
            return results;
        });
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
     * @return {Core/Deferred.<Array.<File/LocalFile | Error>>}
     */
    var getFromFileReader = function (files) {
        var steps = Array.prototype.map.call(files, function (file) {
            var deferred = new Deferred();
            deferred.addCallbacks(function () {
                return new LocalFile(file);
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
    var replaceDir = function (_a) {
        var items = _a.items, files = _a.files;
        // dnd папки в IE стрельнёт событием, но не даст файлов
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
