/**
 * Класс, кэширующий пресеты редактора колонок
 *
 * @class SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Cache
 * @author Спирин В.А.
 * @public
 */
define('SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Cache',
   [
      'Core/Deferred',
      'Core/EventBus',
      'Core/UserConfig',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit'
   ],

   function (Deferred, EventBus, UserConfig, PresetUnit) {
      'use strict';



      /**
       * Префикс пространства имён
       * @private
       * @type {string}
       */
      var _PREFIX = 'ColumnsEditor#';

      /**
       * Длина идентификаторов, генерируемых для новых пресетов
       * @private
       * @type {number}
       */
      var _ID_LENGTH = 24;

      /**
       * Кэш данных
       * @private
       * @type {object}
       */
      var _data = {};

      /**
       * Обещания, ожидающие получения данных
       * @private
       * @type {object}
       */
      var _promises = {};

      /**
       * Отложенные вызовы
       * @private
       * @type {object}
       */
      var _calls = {};

      /**
       * Канал событий
       * @private
       * @type {Core/EventBusChannel}
       */
      var _channel = EventBus.channel();
      var _sublisteners = {oncachechanged:{}, oncacheerror:{}};



      var PresetCache = /**@lends SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Cache.prototype*/ {
         /**
          * Получить список всех имеющихся пресетов редактора колонок
          * @public
          * @param {string} namespace Пространство имён
          * @param {boolean} force Форсировать запрос
          * @return {Core/Deferred<SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit[]>}
          */
         list: function (namespace, force) {
            if (!namespace || typeof namespace !== 'string') {
               throw new Error('Wrong "namespace"');
            }
            if (force) {
               delete _data[namespace];
            }
            var list = _data[namespace];
            if (list) {
               // Есть готовые данные
               return Deferred.success(list);
            }
            if (_promises[namespace]) {
               // Есть ещё не разрешённое обещание
               return _promises[namespace];
            }
            // нет ничего пригодного - запросить
            return _promises[namespace] = UserConfig.getParam(_PREFIX + namespace).addCallbacks(
               function (data) {
                  var values = data && typeof data === 'string' ? JSON.parse(data) : data || [];
                  values = values && Array.isArray(values) && values.length ? values.map(function (value) {
                     var preset = new PresetUnit(value);
                     preset.isStorable = true;
                     return preset;
                  }) : [];
                  _data[namespace] = values;
                  // Если есть отложенные вызовы - выполнить (и сохранить результат)
                  var calls = _calls[namespace];
                  if (calls) {
                     for (var i = 0; i < calls.length; i++) {
                        calls[i].call(null);
                     }
                     _save(namespace);
                  }
                  _channel.notify('onCacheLoaded', namespace, _data[namespace]);
                  return _data[namespace];
               },
               function (err) {
                  delete _data[namespace];
                  _channel.notify('onCacheError', namespace);
               }
            );
         },

         /**
          * Создать пресет редактора колонок
          * @public
          * @param {string} namespace Пространство имён
          * @param {object} data Данные для создания нового пресета редактора колонок
          * @return {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit}
          */
         create: function (namespace, data) {
            data.id = data.id || _uniqueHex(_ID_LENGTH);
            data.isStorable = true;
            var preset = new PresetUnit(data);
            _change(namespace, 'create', preset);
            return preset;
         },

         /**
          * Обновить пресет редактора колонок
          * @public
          * @param {string} namespace Пространство имён
          * @param {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit} preset Пресет редактора колонок
          */
         update: function (namespace, preset) {
            _change(namespace, 'update', preset);
         },

         /**
          * Удалить пресет редактора колонок
          * @public
          * @param {string} namespace Пространство имён
          * @param {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit} preset Пресет редактора колонок
          */
         delete: function (namespace, preset) {
            _change(namespace, 'delete', preset);
         },

         /**
          * Подписаться на событие
          * @public
          * @param {string} namespace Пространство имён
          * @param {string} eventType Тип события
          * @param {function} listener Обработчик события
          */
         subscribe: function (namespace, eventType, listener) {
            _onOff(namespace, eventType, true, listener);
         },

         /**
          * Отписаться от события
          * @public
          * @param {string} namespace Пространство имён
          * @param {string} eventType Тип события
          * @param {function} listener Обработчик события
          */
         unsubscribe: function (namespace, eventType, listener) {
            _onOff(namespace, eventType, false, listener);
         }
      };



      /**
       * Изменить согласно указанному способу пресет редактора колонок
       * @private
       * @param {string} namespace Пространство имён
       * @param {string} action Способ изменения
       * @param {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit} preset Пресет редактора колонок
       */
      var _change = function (namespace, action, preset) {
         if (!namespace || typeof namespace !== 'string') {
            throw new Error('Wrong "namespace"');
         }
         if (!(preset instanceof PresetUnit)) {
            throw new Error('Wrong "preset"');
         }
         if (!preset.isStorable) {
            throw new Error('Not storable');
         }
         if (_data[namespace]) {
            _applyChange(namespace, action, preset);
            _save(namespace);
         }
         else
         if (_promises[namespace]) {
            (_calls[namespace] = _calls[namespace] || []).push(_applyChange.bind(null, namespace, action, preset));
         }
         else {
            throw new Error('Nothing to ' + action);
         }
      };

      /**
       * Выполнить изменение
       * @private
       * @param {string} namespace Пространство имён
       * @param {string} action Способ изменения
       * @param {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit} preset Пресет редактора колонок
       */
      var _applyChange = function (namespace, action, preset) {
         var list = _data[namespace];
         if (!list) {
            throw new Error('Illegal call');
         }
         if (action === 'create') {
            list.push(preset);
         }
         else {
            var i = _findIndex(list, function (value) { return preset.id === value.id; });
            if (i === -1) {
               throw new Error('Not found');
            }
            if (action === 'update') {
               list[i] = preset;
            }
            else
            if (action === 'delete') {
               list.splice(i, 1);
            }
         }
      };

      /**
       * Найти индекс элемента массива
       * @private
       * @param {any[]} list Массив
       * @param {function} checker Обработчик
       * @return {number}
       */
      var _findIndex = function (list, checker) {
         if (list.findIndex) {
            return list.findIndex(checker);
         }
         for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (checker.call(null, item)) {
               return item;
            }
         }
         return -1;
      };

      /**
       * Сохранить данные
       * @private
       * @param {string} namespace Пространство имён
       * @return {Core/Deferred<boolean>}
       */
      var _save = function (namespace) {
         var list = _data[namespace];
         if (!list) {
            throw new Error('Nothing to save');
         }
         _channel.notify('onCacheChanged', namespace, _data[namespace]);
         UserConfig.setParam(_PREFIX + namespace, JSON.stringify(list.map(_toCompact))).addCallbacks(
               function () {
                  _channel.notify('onCacheSaved', namespace, _data[namespace]);
               },
               function (err) {
                  // Произошла ошибка - данные теперь неактуальны, всё сбросить
                  delete _data[namespace];
                  // И уведомить подписчиков
                  _channel.notify('onCacheError', namespace);
               }
         );
      };

      /**
       * Компактифицировать пресет для сохранения
       * @private
       * @param {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit} preset Пресет редактора колонок
       * @return {object}
       */
      var _toCompact = function (preset) {
         var data = {
            id: preset.id,
            title: preset.title
         };
         if (preset.selectedColumns.length) {
            data.selectedColumns = preset.selectedColumns;
         }
         if (preset.expandedGroups.length) {
            data.expandedGroups = preset.expandedGroups;
         }
         return data;
      };

      /**
       * Подписаться/отписаться от события
       * @protected
       * @param {string} namespace Пространство имён
       * @param {string} eventType Тип события
       * @param {boolean} isOn Подписаться или отписвться
       * @param {function} listener Обработчик события
       */
      var _onOff = function (namespace, eventType, isOn, listener) {
         if (!namespace || typeof namespace !== 'string') {
            throw new Error('Wrong "namespace"');
         }
         if (!eventType || typeof eventType !== 'string') {
            throw new Error('Wrong "eventType"');
         }
         if (typeof listener !== 'function') {
            throw new Error('Wrong "listener"');
         }
         var typed = _sublisteners[eventType.toLowerCase()];
         if (!typed) {
            throw new Error('Unknown eventType');
         }
         if (isOn) {
            if (!Object.keys(typed).length) {
               _channel.subscribe(eventType, _onEvent);
            }
            (typed[namespace] = typed[namespace] || []).push(listener);
         }
         else {
            var listeners = typed[namespace];
            var i = listeners ? listeners.indexOf(listener) : -1;
            if (i === -1) {
               throw new Error('Unknown listener');
            }
            if (1 < listeners.length) {
               listeners.splice(i, 1);
            }
            else {
               delete typed[namespace];
            }
            if (!Object.keys(typed).length) {
               _channel.unsubscribe(eventType, _onEvent);
            }
         }
      };

      /**
       * Обработчик событий
       * @private
       * @param {Core/EventObject} evtName Идентификатор события
       * @param {string} namespace Пространство имён
       */
      var _onEvent = function (evtName, namespace) {
         var listeners = _sublisteners[evtName.name][namespace];
         if (listeners) {
            var args = [].slice.call(arguments);
            args.splice(1, 1);
            for (var i = 0; i < listeners.length; i++) {
               listeners[i].apply(null, args);
            }
         }
      };

      /**
       * Сгенерировать случайную hex-строку указанной длины
       * @protected
       * @param {number} n Длина строки
       * @return {string}
       */
      var _uniqueHex = function(n){var l=[];for(var i=0;i<n;i++){l[i]=Math.round(15*Math.random()).toString(16)}return l.join('')};



      // Опубликовать свои события
      _channel.publish('onCacheLoaded', 'onCacheChanged', 'onCacheSaved', 'onCacheError');

      return PresetCache;
   }
);
