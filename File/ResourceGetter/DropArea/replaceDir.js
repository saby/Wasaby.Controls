"use strict";
/// <amd-module name="File/ResourceGetter/DropArea/replaceDir" />
var ParallelDeferred = require("Core/ParallelDeferred");
var Deferred = require("Core/Deferred");
var DROP_FOLDER_ERROR = rk('Загрузка папки не поддерживается браузером');
var UNKNOWN_FILE_TYPE = rk('Неизвестный тип файла');
var travel;
var travelInEntries;
/**
 * Развёртка двумерного массива в одномерный
 * @param {Array<T | Array<T>>} array
 * @return {Array<T>}
 */
var toPlainArray = function (array) {
    return Array.prototype.concat.apply([], array);
};
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
travel = function (entry, path) {
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
travelInEntries = function (entries, path) {
    var length = entries.length;
    return new ParallelDeferred({
        steps: entries.map(function (entry) {
            return travel(entry, path);
        }),
        stopOnFirstError: false
    }).done().getResult().addCallback(function (results) {
        /*
         * results:
         * а) объект с ключами в виде числа
         * б) содержит в себе либо <File | Error> или <Array<File | Error>>
         * Поэтому собираем из него массив и избавляемся от двумерности
         */
        results.length = length;
        return toPlainArray(Array.prototype.slice.call(results));
    });
};
/**
 * Преобразует данные из объекта DataTransferItemList в массив WebKitEntry и запускает рекурсивный обход по ним
 * @param {DataTransferItemList} items
 * @return {Deferred.<Array.<File | Error>>}
 */
var getFromTransferItems = function (items) {
    var entries = [];
    var length = items.length;
    for (var i = 0; i < length; i++) {
        entries.push(items[i].webkitGetAsEntry());
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
var replaceDir = function (_a) {
    var items = _a.items, files = _a.files;
    var len = files.length;
    if (!len) {
        return Deferred.success([]);
    }
    var isIncludeDir;
    for (var i = 0; i < len; i++) {
        var file = files[i];
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
    var result = [];
    for (var i = 0; i < len; i++) {
        var file = files[i];
        // Если просто файл, то вернём как есть
        if (!file.type) {
            result.push(file);
            continue;
        }
        result.push(new Error(DROP_FOLDER_ERROR));
    }
    return Deferred.success(result);
};
module.exports = replaceDir;
