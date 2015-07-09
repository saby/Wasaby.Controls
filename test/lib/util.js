/* global exports */

/**
 * Утилиты
 */

var sysfs = require('fs');




exports.fs = {};

/**
 * Рекурсивно удаляет каталог
 * @param {String} path Удаляемый каталог
 */
exports.fs.rmdir = function(path) {
    if(sysfs.existsSync(path) ) {
        sysfs.readdirSync(path).forEach(function(file,index) {
            var curPath = path + '/' + file;
            if (sysfs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                sysfs.unlinkSync(curPath);
            }
        });
        sysfs.rmdirSync(path);
    }
};




exports.config = {};

/**
 * Заменяет значения параметров конфига значенияеми из переменных окружения
 * @param {String} path Удаляемый каталог
 */
exports.config.fromEnv = function(config, prefix) {
    prefix = prefix ? prefix + '_' : '';

    for (var key in config) {
        if (config.hasOwnProperty(key)) {
            if (typeof config[key] == 'object') {
                exports.config.fromEnv(config[key], prefix + key);
            } else {
                var envKey = prefix + key;
                if (process.env[envKey] !== undefined) {
                    config[key] = process.env[envKey];
                }
            }
        }
    }
};
