/* global exports */

/**
 * Утилиты
 */

var sysfs = require('fs'),
    path = require('path'),
   fs = {};

/**
 * Рекурсивно создает каталог
 * @param {String} pathname Создаваемый каталог
 */
fs.mkdir = function(pathname, mode) {
   if (pathname && !sysfs.existsSync(pathname)) {
      fs.mkdir(path.dirname(pathname), mode);
      sysfs.mkdirSync(pathname, mode);
   }
};

/**
 * Рекурсивно удаляет каталог
 * @param {String} path Удаляемый каталог
 */
fs.rmdir = function (path) {
   if (sysfs.existsSync(path)) {
      sysfs.readdirSync(path).forEach(function (file, index) {
         var curPath = path + '/' + file;
         if (sysfs.lstatSync(curPath).isDirectory()) {
            fs.rmdir(curPath);
         } else {
            sysfs.unlinkSync(curPath);
         }
      });
      sysfs.rmdirSync(path);
   }
};

exports.fs = fs;

exports.config = {};

/**
 * Заменяет значения параметров конфига значенияеми из переменных окружения
 * @param {String} path Удаляемый каталог
 */
exports.config.fromEnv = function (config, prefix) {
   prefix = prefix ? prefix + '_' : '';

   var value;
   for (var key in config) {
      if (config.hasOwnProperty(key)) {
         if (typeof config[key] == 'object') {
            exports.config.fromEnv(config[key], prefix + key);
         } else {
            var envKey = prefix + key;
            if (process.env[envKey] !== undefined) {
               value = process.env[envKey];
               if (typeof config[key] === 'boolean') {
                  value = Number(value) !== 0;
               }
               config[key] = value;
            }
         }
      }
   }
};
