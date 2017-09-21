/**
 * Постзагрузчик методов класса
 * @class SBIS3.CONTROLS.LongOperations.Tools.Postloader
 * @public
 */

define('js!SBIS3.CONTROLS.LongOperations.Tools.Postloader',
   [
      'Core/Deferred'
   ],

   function (Deferred) {
      'use strict';

      /**
       * Конструктор
       * @public
       * @param {string} sourceModule Имя модуля(класса) с библиотекой методов класса для постзагрузки
       * @param {any[]} initArgs Массив аргументов инициализации модуля(класса) с библиотекой
       */
      var Postloader = function (sourceModule, initArgs) {
         if (!sourceModule || typeof sourceModule !== 'string') {
            throw new TypeError('Argument "sourceModule" must be a string');
         }
         this._src = sourceModule;
         this._args = initArgs;
         this._mod = null;
      };

      Postloader.prototype = /** @lends SBIS3.CONTROLS.LongOperations.Tools.Postloader.prototype */{
         /**
          * Возвращает метод-заглушку, при вызове которого:
          * - будет возвращено обещание
          * - начнётся загрузка библиотеки
          * - после загрузки метод с указанным именем будет импортирован из библиотеки в целевой объект
          * - импортированный метод будет вызван и результат после получения будет возвращён в обещание
          * - При дальнейших обращениях будет отрабатывать загруженный метод сам по себе
          * Методы-заглушки обязательно должна вызываться в объектном контексте
          * @public
          * @param {string} name Имя постзагружаемого метода
          * @return {function<Core/Deferred>}
          */
         method: function (name) {
            if (!name || typeof name !== 'string') {
               throw new TypeError('Argument "name" must be a string');
            }
            var postloader = this;
            return function () {
               if (!this || typeof this !== 'object') {
                  throw new Error('Сall without object context');
               }
               // Здесь this ссылается на объект, как метод которого вызвана заглушка
               return _load.call(this, postloader, name, [].slice.call(arguments));
            };
         }
      };

      Postloader.prototype.constructor = Postloader;

      /**
       * Функция вызывается из методов-заглушек
       * @protected
       * @param {SBIS3.CONTROLS.LongOperations.Tools.Postloader} postloader Этот объект
       * @param {string} method Имя постзагружаемого метода
       * @param {any[]} args Аргументы, с которыми был вызван метод-заглушка
       * @return {Core/Deferred}
       */
      var _load = function (postloader, method, args) {
         var promise = new Deferred();
         if (postloader._mod) {
            // Если библиотека уже загружена - применить сразу
            _apply(this, method, postloader._mod[method], args, promise);
         }
         else {
            // Иначе - загрузить и применить после этого
            require([postloader._src], function (modFunc) {
               if (!modFunc || typeof modFunc !== 'function') {
                  promise.errback(new TypeError('Loaded module must be a function'));
                  return;
               }
               var modObj = modFunc.apply(null, postloader._args);
               if (!modObj || typeof modObj !== 'object') {
                  promise.errback(new TypeError('Module function must return an object'));
                  return;
               }
               postloader._mod = modObj;
               delete postloader._src;
               delete postloader._args;
               _apply(this, method, postloader._mod[method], args, promise);
            }.bind(this));
         }
         return promise;
      };

      /**
       * Применить загруженный метод
       * @protected
       * @param {object} target Объект - владелец метода
       * @param {string} methodName Имя метода
       * @param {function} methodFunc Тело метода
       * @param {any[]} args Аргументы реального вызова метода
       * @param {Core/Deferred} promise Обещание результата
       */
      var _apply = function (target, methodName, methodFunc, args, promise) {
         if (!methodFunc || typeof methodFunc !== 'function') {
            promise.errback(new TypeError('Loaded module does not contain specified method'));
            return;
         }
         target[methodName] = methodFunc;
         var value;
         try {
            value = methodFunc.apply(target, args);
         }
         catch (ex) {
            promise.errback(ex);
            return;
         }
         promise[value instanceof Deferred ? 'dependOn' : 'callback'](value);
      };

      return Postloader;
   }
);
