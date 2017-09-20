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
       */
      var Postloader = function (sourceModule) {
         if (!sourceModule || typeof sourceModule !== 'string') {
            throw new TypeError('Argument "sourceModule" must be a string');
         }
         this._src = sourceModule;
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
          * @public
          * @param {object} target Объект - владелец постзагружаемого метода
          * @param {string} name Имя постзагружаемого метода
          * @return {function<Core/Deferred>}
          */
         method: function (target, name) {
            if (!target || typeof target !== 'object') {
               throw new TypeError('Argument "target" must be an object');
            }
            if (!name || typeof name !== 'string') {
               throw new TypeError('Argument "name" must be a string');
            }
            return _load.bind(null, this, target, name);
         }
      };

      Postloader.prototype.constructor = Postloader;

      /**
       * Функция, порождающая методы-заглушки
       * @protected
       * @param {SBIS3.CONTROLS.LongOperations.Tools.Postloader} self Этот объект
       * @param {object} target Объект - владелец постзагружаемого метода
       * @param {string} method Имя постзагружаемого метода
       * @return {Core/Deferred}
       */
      var _load = function (self, target, method) {
         // Поскольку метод-заглушка вызывается с какими-то реальными аргументами - нужно передать их дальше
         var args = 3 < arguments.length ? [].slice.call(arguments, 3) : [];
         var promise = new Deferred();
         if (self._mod) {
            // Если библиотека уже загружена - применить сразу
            _apply(target, method, self._mod[method], args, promise);
         }
         else {
            // Иначе - загрузить и применить после этого
            require([self._src], function (module) {
               if (!module || typeof module !== 'object') {
                  promise.errback(new TypeError('Loaded module must be an object'));
                  return;
               }
               self._mod = module;
               _apply(target, method, self._mod[method], args, promise);
            });
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
         promise.callback(value);
      };

      return Postloader;
   }
);
