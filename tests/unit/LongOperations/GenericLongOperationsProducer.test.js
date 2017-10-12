/* global:object define:function, beforeEach:function, afterEach:function, describe:function, context:function, it:function, assert:function, $ws:object */
define([
      'js!SBIS3.CONTROLS.LongOperations.GenericProducer',
      'js!SBIS3.CONTROLS.LongOperations.Entry',
      'js!SBIS3.CONTROLS.LongOperations.Const',
      'Core/core-instance',
      'Core/Deferred',
      'Core/UserInfo'
   ],

   function (GenericLongOperationsProducer, LongOperationEntry, LongOperationsConst, CoreInstance, Deferred, UserInfo) {
      'use strict';

      if (typeof mocha !== 'undefined') {
         mocha.setup({/*ignoreLeaks:true,*/ globals:[/*'*',*/ '__extends', 'sharedBusDebug', 'sharedBusLog', 'Lib/ServerEventBus/class/logger/ConnectWatchDog', 'Lib/ServerEventBus/class/logger/ConsoleDocviewWatchDog']});
      }

      var MODULE = 'SBIS3.CONTROLS.LongOperations.GenericProducer';
      var IS_NODEJS = typeof process !== 'undefined';

      var userInfo = {
         'Пользователь': 861523,
         'ИдентификаторСервисаПрофилей': '8cab8a51-da51-40fd-bef3-6f090edbdeaa'
      };

      var TIME_EARLIER  = 100000;//ms
      var TIME_GAP      =  10000;//ms
      var TIME_RATTLING =    200;//ms

      var globalFixes;
      if (IS_NODEJS) {
         globalFixes = {};
         var _localStorage = {
            _data: {},
            get length () {
               return Object.keys(this._data).length;
            },
            key: function (i) {
               return Object.keys(this._data)[i];
            },
            setItem: function (name, value) {
               this._data[name] = '' + value;
            },
            getItem: function (name) {
               return name in this._data ? '' + this._data[name] : undefined;
            },
            removeItem: function (name) {
               delete this._data[name];
            },
         };
         globalFixes.localStorage = 'localStorage' in global ? {prev:global.localStorage} : {};
         global.localStorage = _localStorage;
      }

      if (!UserInfo.get.isSinonProxy) {
         sinon.stub(UserInfo, 'get').callsFake(function (name) { return userInfo[name]; });
      }



      // Попробовать создать новый экземпляр
      var _makeProducer = function (name, dontClear) {
         var producer;
         try {
            producer = new GenericLongOperationsProducer(name);
         }
         catch (ex) {
            it('Невозможно создать экземпляр', function () {
               assert.ifError(ex);
            });
         }
         if (!dontClear) {
            _lsTool.clear(name);
         }
         return producer;
      };

      // Прсотой инструмент для локального хранилища
      var _lsTool = {
         search: function (ns, options) {
            var data = this._check(ns, false);
            if (!options || !options.counter) {
               delete data['(n)'];
            }
            if (!options || !options.raw) {
               for (var k in data) {
                  data[k] = JSON.parse(data[k]);
               }
            }
            return data;
         },
         clear: function (ns) {
            this._check(ns, true);
         },
         _check: function (ns, andRemove) {
            var prefix = 'wslop-gen(' + (ns || '') + ')-';
            var list = !andRemove ? {} : null;
            for (var i = localStorage.length - 1; 0 <= i; i--) {
               var name = localStorage.key(i);
               if (name.indexOf(prefix) === 0) {
                  if (andRemove) {
                     localStorage.removeItem(name);
                  }
                  else {
                     list[name.substring(prefix.length)] = localStorage.getItem(name);
                  }
               }
            }
            if (!andRemove) {
               return list;
            }
         },
      };

      var _byTitles = function (snapshots, titles) {
         return Object.keys(snapshots)
            .reduce(function (r, v) { var o = snapshots[v]; if (titles.indexOf(o.title) !== -1) { r.push(o); }; return r; }, [])
            .sort(function (v1, v2) { return v1 < v2 ? -1 : (v2 < v1 ? + 1 : 0); });
      };

      var _deferred2Promise = function  (deferred) {
         var p = new Promise(function (resolve, reject) {
            deferred.addCallbacks(resolve, reject);
         });
         return p;
      };

      describe('LongOperations: GenericLongOperationsProducer', function () {

         after(function () {
            // Всё почистить
            _lsTool.clear(null);
            _lsTool.clear('Первый');
            _lsTool.clear('Второй');
            _lsTool.clear('Под ликвидацию 1');
            /*if (globalFixes) {
               for (var n in globalFixes) {
                  var value = globalFixes[n];
                  if ('prev' in value) {
                     global[n] = value.prev;
                  }
                  else {
                     delete global[n];
                  }
               }
            }*/
         });

         describe('Создание экземпляра и API', function () {
            // Статические методы класса
            var signatures = {
               getInstance: 1
            };
            Object.keys(signatures).forEach(function (method) {
               var len = signatures[method];
               var useLen = typeof len === 'number';
               it('Статический метод класса ' + method + (useLen ? ' (' + len + ')' : ''), function () {
                  var f = GenericLongOperationsProducer[method];
                  assert.isFunction(f, 'Метод отсутствует');
                  if (useLen && typeof f === 'function') {
                     assert.equal(len, f.length, 'Количество аргументов');
                  }
               });
            });

            it('Аргумент не может быть числом', function () {
               assert.throws(function () {
                  var p = GenericLongOperationsProducer.getInstance(1);
               }, Error);
            });

            it('Аргумент не может быть объектом', function () {
               assert.throws(function () {
                  var p = GenericLongOperationsProducer.getInstance({'что-то':'здесь'});
               }, Error);
            });

            it('Аргумент должен быть null-ём или строкой', function () {
               assert.doesNotThrow(function () {
                  var p1 = GenericLongOperationsProducer.getInstance(null);
                  var p2 = GenericLongOperationsProducer.getInstance('Первый');
               }, Error);
            });

            var producer = _makeProducer(null);
            if (!producer) {
               return;
            }

            it('Создание экземпляра', function () {
               assert.instanceOf(producer, GenericLongOperationsProducer);
            });

            it('Имя (аргумент конструктора) не может быть числом', function () {
               assert.throws(function () {
                  var p = new GenericLongOperationsProducer(1);
               }, Error);
            });

            it('Имя (аргумент конструктора) не может быть объектом', function () {
               assert.throws(function () {
                  var p = new GenericLongOperationsProducer({'что-то':'здесь'});
               }, Error);
            });

            it('Имя (аргумент конструктора) должен быть null-ём или строкой', function () {
               assert.doesNotThrow(function () {
                  var p1 = new GenericLongOperationsProducer(null);
                  var p2 = new GenericLongOperationsProducer('Первый');
               }, Error);
            });

            // Методы экземпляра
            var signatures = {
               getName: 0,
               hasCrossTabEvents: 0,
               hasCrossTabData: 0,
               fetch: 1,
               callAction: 2,
               subscribe: 3,
               unsubscribe: 3,
               canDestroySafely: 0,
               make: 2,
               destroy: 0
            };
            Object.keys(signatures).forEach(function (method) {
               var len = signatures[method];
               var useLen = typeof len === 'number';
               it('Метод экземпляра ' + method + (useLen ? ' (' + len + ')' : ''), function () {
                  var f = producer[method];
                  assert.isFunction(f, 'Метод отсутствует');
                  if (useLen && typeof f === 'function') {
                     assert.equal(f.length, len, 'Количество аргументов');
                  }
               });
            });

            // События
            var events = [
               'onlongoperationstarted',
               'onlongoperationchanged',
               'onlongoperationended',
               'onlongoperationdeleted'
            ];
            events.forEach(function (evtType) {
               it('Событие ' + evtType, function () {
                  assert.include(producer._publishedEvents, evtType, 'Событие отсутствует');
               });
            });

            it('Созданный экземпляр реализует интерфейс ILongOperationsProducer', function () {
               assert.isOk(CoreInstance.instanceOfMixin(producer, 'SBIS3.CONTROLS.LongOperations.IProducer'));
            });

            it('Метод getInstance и конструктор возвращают один и тот же экземпляр', function () {
               assert.strictEqual(GenericLongOperationsProducer.getInstance(null), new GenericLongOperationsProducer(null));
               assert.strictEqual(GenericLongOperationsProducer.getInstance('Первый'), new GenericLongOperationsProducer('Первый'));
               assert.strictEqual(GenericLongOperationsProducer.getInstance('Второй'), new GenericLongOperationsProducer('Второй'));
            });

            it('Каждому имени соответствует единственный экземпляр', function () {
               assert.strictEqual(GenericLongOperationsProducer.getInstance(null), GenericLongOperationsProducer.getInstance(null));
               assert.strictEqual(GenericLongOperationsProducer.getInstance('Первый'), GenericLongOperationsProducer.getInstance('Первый'));
               assert.strictEqual(GenericLongOperationsProducer.getInstance('Второй'), GenericLongOperationsProducer.getInstance('Второй'));
            });

            it('После ликвидации ликвидации одного экземпляра следующий создаваемый экземпляр не будет тем же синглетоном, что и ликвидированный', function () {
               var destroyed = new GenericLongOperationsProducer('Под ликвидацию 1');
               var destroyed2 = new GenericLongOperationsProducer('Под ликвидацию 1');
               assert.strictEqual(destroyed, destroyed2);
               destroyed.destroy();
               var notDestroyed = new GenericLongOperationsProducer('Под ликвидацию 1');
               assert.notStrictEqual(notDestroyed, destroyed);
            });
         });


         describe('Метод getName - Получить имя экземпляра', function () {
            var producer = _makeProducer(null);
            if (!producer) {
               return;
            }
            var p2 = _makeProducer('Второй');
            if (!p2) {
               return;
            }

            it('Возвращается правильное значение', function () {
               assert.strictEqual(producer.getName(), MODULE);
               assert.strictEqual(p2.getName(), MODULE + ':Второй');
            });

            it('После разрушения экземпляра также возвращается правильное значение', function () {
               var destroyed = _makeProducer('Под ликвидацию 1');
               destroyed.destroy();
               assert.strictEqual(destroyed.getName(), MODULE + ':Под ликвидацию 1');
            });
         });


         describe('Метод hasCrossTabEvents - Являются ли события кросс-вкладочными', function () {
            var producer = _makeProducer(null);
            if (!producer) {
               return;
            }

            it('Возвращается правильное значение', function () {
               assert.strictEqual(producer.hasCrossTabEvents(), false);
            });
         });


         describe('Метод hasCrossTabData - Являются ли данные кросс-вкладочными', function () {
            var producer = _makeProducer(null);
            if (!producer) {
               return;
            }

            it('Возвращается правильное значение', function () {
               assert.strictEqual(producer.hasCrossTabData(), true);
            });
         });


         describe('Метод make - Начать отслеживать ход операции', function () {
            var producer = _makeProducer(null);
            if (!producer) {
               return;
            }

            it('Параметры операции не могут быть числом', function () {
               assert.throws(function () {
                  producer.make(1, new Deferred());
               }, Error);
            });

            it('Параметры операции не могут быть строкой', function () {
               assert.throws(function () {
                  producer.make('Что-то', new Deferred());
               }, Error);
            });

            it('Параметры операции не могут быть null-ём', function () {
               assert.throws(function () {
                  producer.make(null, new Deferred());
               }, Error);
            });

            it('Параметры операции не могут быть объектом без обязательных свойств', function () {
               assert.throws(function () {
                  producer.make({'что-то':'здесь'}, new Deferred());
               }, Error);
            });

            it('Параметры операции не могут содержать свойство title с типом число', function () {
               assert.throws(function () {
                  producer.make({title:1}, new Deferred());
               }, Error);
            });

            it('Параметры операции не могут содержать свойство title с типом объект', function () {
               assert.throws(function () {
                  producer.make({title:{'что-то':'здесь'}}, new Deferred());
               }, Error);
            });

            it('Отложенный останов не может быть числом', function () {
               assert.throws(function () {
                  producer.make({title:'Длительная операция (Ошибка 1)'}, 1);
               }, Error);
            });

            it('Отложенный останов не может быть строкой', function () {
               assert.throws(function () {
                  producer.make({title:'Длительная операция (Ошибка 2)'}, 'Что-то');
               }, Error);
            });

            it('Отложенный останов не может быть null-ём', function () {
               assert.throws(function () {
                  producer.make({title:'Длительная операция (Ошибка 3)'}, null);
               }, Error);
            });

            it('Параметры операции должны быть объектом с корректными свойствами, отложенный останов должен быть экземпляром Core/Deferred', function () {
               assert.doesNotThrow(function () {
                  producer.make({title:'Длительная операция 1', status:LongOperationEntry.STATUSES.ended}, new Deferred());
                  producer.make({title:'Длительная операция 2', startedAt:(new Date()).getTime() - TIME_EARLIER, status:LongOperationEntry.STATUSES.suspended}, new Deferred());
                  producer.make({title:'Длительная операция 3', startedAt:new Date(), onSuspend:new Function(''), onResume:new Function(''), onDelete:new Function('')}, new Deferred());
               }, Error);
            });

            it('При создании операций будут сформированы события onlongoperationstarted на каждую операцию', function (done) {
               var destroyed = new GenericLongOperationsProducer('Под ликвидацию 1');
               destroyed.subscribe('onlongoperationstarted', function (evtName, evt) {
                  try {
                     assert.isObject(evtName);
                     assert.property(evtName, 'name');
                     assert.strictEqual(evtName.name, 'onlongoperationstarted');
                     assert.isObject(evt);
                     assert.property(evt, 'producer');
                     assert.strictEqual(evt.producer, MODULE + ':Под ликвидацию 1');
                     assert.property(evt, 'operationId');
                     var id = evt.operationId;
                     var allIds = Object.keys(_lsTool.search('Под ликвидацию 1'));
                     assert.include(allIds, '' + id);
                     assert.isNumber(id);
                     assert.equal(id%1, 0);
                     assert.operator(id, '>', 0);
                     done();
                  }
                  catch (err) {
                     done(err);
                  }
               });
               destroyed.make({title:'Удаляемая операция'}, new Deferred());
               destroyed.destroy();
               _lsTool.clear('Под ликвидацию 1');
            });

            it('Снимки всех созданных операций есть в локальном хранилище', function () {
               var data = _lsTool.search(null, {raw:true});
               var list = [];
               assert.doesNotThrow(function () {
                  for (var k in data) {
                     list.push(JSON.parse(data[k]));
                  }
               }, Error);
               var titles = ['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'];
               var snapshots = list.filter(function (v) { return titles.indexOf(v.title) !== -1; });
               assert.lengthOf(snapshots, titles.length);
            });

            it('Снимки всех созданных операций получили корректные идентификаторы', function () {
               var titles = ['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'];
               var ids = _byTitles(_lsTool.search(null), titles).map(function (v) { return v.id; });
               assert.lengthOf(ids, titles.length);
               assert.isNumber(ids[0]);
               assert.isNumber(ids[1]);
               assert.isNumber(ids[2]);
               assert.equal(ids[0]%1, 0);
               assert.equal(ids[1]%1, 0);
               assert.equal(ids[2]%1, 0);
               assert.operator(ids[0], '<', ids[1]);
               assert.operator(ids[1], '<', ids[2]);
            });

            it('В локальном хранилище есть счётчик экземпляров равный значению последнего выданного идентификатора', function () {
               var data = _lsTool.search(null, {raw:true, counter:true});
               assert.property(data, '(n)');
               var counter = +data['(n)'];
               assert.isNumber(counter);
               assert.isNotNaN(counter);
               delete data['(n)'];
               var maxId = Object.keys(data).reduce(function (r, v) { var id = +v; if (r < id) { r = id; }; return r; }, -1);
               assert.strictEqual(counter, maxId);
            });

            it('Снимки всех созданных операций имеют правильные значения времени начала операции', function () {
               var titles = ['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'];
               var startedAts = _byTitles(_lsTool.search(null), titles).map(function (v) { return v.startedAt; });
               assert.lengthOf(startedAts, titles.length);
               var time = (new Date()).getTime();
               assert.isNumber(startedAts[0]);
               assert.isNumber(startedAts[1]);
               assert.isNumber(startedAts[2]);
               assert.closeTo(startedAts[0], time, TIME_RATTLING);
               assert.closeTo(startedAts[1], time - TIME_EARLIER, TIME_RATTLING);
               assert.closeTo(startedAts[2], time, TIME_RATTLING);
            });

            it('Снимки всех созданных операций имеют правильные значения статуса операции', function () {
               var titles = ['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'];
               var list = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(list, titles.length);
               assert.property(list[0], 'status', LongOperationEntry.STATUSES.ended);
               assert.property(list[1], 'status', LongOperationEntry.STATUSES.suspended);
               assert.notProperty(list[2], 'status');//LongOperationEntry.STATUSES.running
            });

            it('Снимки всех созданных операций имеют правильные значения свойств canSuspend и canDelete', function () {
               var titles = ['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'];
               var list = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(list, titles.length);
               assert.isFalse(list[0].canSuspend);
               assert.isFalse(list[0].canDelete);
               assert.isFalse(list[1].canSuspend);
               assert.isFalse(list[1].canDelete);
               assert.notProperty(list[2], 'canSuspend');
               assert.notProperty(list[2], 'canDelete');
            });

            it('Снимки всех созданных операций имеют правильные значения идентификатора пользователя', function () {
               var titles = ['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'];
               var list = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(list, titles.length);
               var userId = userInfo['Пользователь'];
               for (var i = 0; i < list.length; i++) {
                  assert.property(list[i], 'userId', userId);
               }
            });

            it('Снимки всех созданных операций имеют правильные значения идентификатора сервиса профилей', function () {
               var titles = ['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'];
               var list = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(list, titles.length);
               var userUuId = userInfo['ИдентификаторСервисаПрофилей'];
               for (var i = 0; i < list.length; i++) {
                  assert.property(list[i], 'userUuId', userUuId);
               }
            });

            it('Снимки всех созданных операций имеют правильные функции действий', function () {
               var titles = ['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'];
               var list = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(list, titles.length);
               assert.property(producer, '_actions');
               var actions = producer._actions;
               assert.isObject(actions);
               for (var i = 0; i < list.length; i++) {
                  var id = list[i].id;
                  if (i !== list.length - 1) {
                     assert.notProperty(actions, id);
                  }
                  else {
                     var o = actions[id];
                     assert.isObject(o);
                     assert.isFunction(o.onSuspend);
                     assert.isFunction(o.onResume);
                     assert.isFunction(o.onDelete);
                     //^^^ Хорошо бы проверить, что это именно те функции
                  }
               }
            });

            it('После разрушения экземпляра ничего не создаётся', function () {
               var destroyed = _makeProducer('Под ликвидацию 1');
               destroyed.destroy();
               destroyed.make({title:'Не созданная операция 1'}, new Deferred());
               var list = _byTitles(_lsTool.search('Под ликвидацию 1', {raw:true}), ['Не созданная операция 1']);
               assert.lengthOf(list, 0);
            });
         });


         describe('Метод fetch - Запросить набор операций', function () {
            var producer = _makeProducer(null);
            if (!producer) {
               return;
            }

            var _ordered = function (list, isDirectly) {
               var ordered = list.slice();
               ordered.sort(function (a, b) { var x = a < b ? -1 : (b < a ? +1 : 0); return isDirectly ? x : -x; });
               return ordered;
            };

            it('Параметры запроса не могут быть числом', function () {
               assert.throws(function () {
                  producer.fetch(1);
               }, Error);
            });

            it('Параметры запроса не могут быть строкой', function () {
               assert.throws(function () {
                  producer.fetch('Что-то');
               }, Error);
            });

            it('Параметры запроса должны быть объектом или null-ём', function () {
               assert.doesNotThrow(function () {
                  producer.fetch(null);
                  producer.fetch({});
                  producer.fetch({'что-то':'здесь'});
                  producer.fetch({'что-то':'здесь', 'где-то':'там'})
               }, Error);
            });

            it('Параметр запроса where не может быть числом', function () {
               assert.throws(function () {
                  producer.fetch({where:1});
               }, Error);
            });

            it('Параметр запроса where не может быть строкой', function () {
               assert.throws(function () {
                  producer.fetch({where:'Что-то'});
               }, Error);
            });

            it('Параметр запроса where должен быть объектом или null-ём', function () {
               assert.doesNotThrow(function () {
                  producer.fetch({where:null});
                  producer.fetch({where:{'что-то':'здесь'}});
               }, Error);
            });

            it('Параметр запроса orderBy не может быть числом', function () {
               assert.throws(function () {
                  producer.fetch({orderBy:1});
               }, Error);
            });

            it('Параметр запроса orderBy не может быть строкой', function () {
               assert.throws(function () {
                  producer.fetch({orderBy:'Что-то'});
               }, Error);
            });

            it('Параметр запроса orderBy должен быть объектом или null-ём', function () {
               assert.doesNotThrow(function () {
                  producer.fetch({orderBy:null});
                  producer.fetch({orderBy:{'что-то':'здесь'}});
               }, Error);
            });

            it('Параметр запроса offset не может быть отрицательным числом', function () {
               assert.throws(function () {
                  producer.fetch({offset:-10});
               }, Error);
            });

            it('Параметр запроса offset не может быть строкой', function () {
               assert.throws(function () {
                  producer.fetch({offset:'Что-то'});
               }, Error);
            });

            it('Параметр запроса offset не может быть объектом', function () {
               assert.throws(function () {
                  producer.fetch({offset:{}});
               }, Error);
            });

            it('Параметр запроса offset должен быть неотрицательным числом или null-ём', function () {
               assert.doesNotThrow(function () {
                  producer.fetch({offset:null});
                  producer.fetch({offset:0});
                  producer.fetch({offset:10});
               }, Error);
            });

            it('Параметр запроса limit не может быть отрицательным числом', function () {
               assert.throws(function () {
                  producer.fetch({limit:-10});
               }, Error);
            });

            it('Параметр запроса limit не может быть строкой', function () {
               assert.throws(function () {
                  producer.fetch({limit:'Что-то'});
               }, Error);
            });

            it('Параметр запроса limit не может быть объектом', function () {
               assert.throws(function () {
                  producer.fetch({limit:{}});
               }, Error);
            });

            it('Параметр запроса limit должен быть не отрицательным числом или null-ём', function () {
               assert.doesNotThrow(function () {
                  producer.fetch({limit:null});
                  producer.fetch({limit:0});
                  producer.fetch({limit:10});
               }, Error);
            });

            it('Параметр запроса extra не может быть числом', function () {
               assert.throws(function () {
                  producer.fetch({extra:1});
               }, Error);
            });

            it('Параметр запроса extra не может быть строкой', function () {
               assert.throws(function () {
                  producer.fetch({extra:'Что-то'});
               }, Error);
            });

            it('Параметр запроса extra должен быть объектом или null-ём', function () {
               assert.doesNotThrow(function () {
                  producer.fetch({extra:null});
                  producer.fetch({extra:{'что-то':'здесь'}});
               }, Error);
            });

            it('Возвращаемое значение является экземпляром класса Core/Deferred', function () {
               assert.instanceOf(producer.fetch(null), Deferred);
            });

            it('Возвращаемый обещаный результат разрешается массивом экземпляров класса SBIS3.CONTROLS.LongOperations.Entry', function (done) {
               producer.fetch(null)
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        for (var i = 1; i < results.length; i++) {
                           assert.instanceOf(results[i], LongOperationEntry);
                        }
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Все параметры запроса, отличные от where, orderBy, offset, limit и extra игнорируются, пустой объект запроса эквивалентен null-ю', function (done) {
               Promise.all([
                  producer.fetch(null),
                  producer.fetch({}),
                  producer.fetch({'что-то':'здесь'}),
                  producer.fetch({'где-то':'там'}),
                  producer.fetch({'что-то':'здесь', 'где-то':'там'})
               ].map(_deferred2Promise))
                  .then(function (allResults) {
                     try {
                        for (var i = 1; i < allResults.length; i++) {
                           assert.deepEqual(allResults[i], allResults[0]);
                        }
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по конкретному значению title)', function (done) {
               producer.fetch({where:{title:'Длительная операция 1'}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 1);
                        assert.instanceOf(results[0], LongOperationEntry);
                        assert.strictEqual(results[0].title, 'Длительная операция 1');
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по списку значений title)', function (done) {
               producer.fetch({where:{title:['Длительная операция 1', 'Длительная операция 3', 'Несуществующая операция']}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 2);
                        for (var i = 0; i < results.length; i++) {
                           assert.instanceOf(results[i], LongOperationEntry);
                           assert.include(['Длительная операция 1', 'Длительная операция 3'], results[i].title);
                        }
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по подстроке в title-е без учёта регистра)', function (done) {
               producer.fetch({where:{title:{condition:'contains', value:' опеРАЦИЯ '}}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 3);
                        for (var i = 0; i < results.length; i++) {
                           assert.instanceOf(results[i], LongOperationEntry);
                           assert.include(['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'], results[i].title);
                        }
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по подстроке в title-е с учётом регистра)', function (done) {
               producer.fetch({where:{title:{condition:'contains', value:' опеРАЦИЯ ', sensitive:true}}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 0);
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по сравнению title &lt; заданного)', function (done) {
               producer.fetch({where:{title:{condition:'<', value:'Длительная операция 2'}}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 1);
                        assert.instanceOf(results[0], LongOperationEntry);
                        assert.strictEqual(results[0].title, 'Длительная операция 1');
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по сравнению title &lt;= заданного)', function (done) {
               producer.fetch({where:{title:{condition:'<=', value:'Длительная операция 2'}}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 2);
                        for (var i = 0; i < results.length; i++) {
                           assert.instanceOf(results[i], LongOperationEntry);
                           assert.include(['Длительная операция 1', 'Длительная операция 2'], results[i].title);
                        }
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по сравнению title &gt;= заданного)', function (done) {
               producer.fetch({where:{title:{condition:'>=', value:'Длительная операция 2'}}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 2);
                        for (var i = 0; i < results.length; i++) {
                           assert.instanceOf(results[i], LongOperationEntry);
                           assert.include(['Длительная операция 2', 'Длительная операция 3'], results[i].title);
                        }
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по сравнению title &gt; заданного)', function (done) {
               producer.fetch({where:{title:{condition:'>', value:'Длительная операция 2'}}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 1);
                        assert.instanceOf(results[0], LongOperationEntry);
                        assert.strictEqual(results[0].title, 'Длительная операция 3');
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по сравнению startedAt &lt; с сейчас - ' + TIME_GAP + 'мс)', function (done) {
               var time = (new Date()).getTime() - TIME_GAP;
               producer.fetch({where:{startedAt:{condition:'<', value:time}}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 1);
                        assert.instanceOf(results[0], LongOperationEntry);
                        assert.operator(results[0].startedAt, '<', time);
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по сравнению startedAt &lt; с сейчас + ' + TIME_GAP + 'мс)', function (done) {
               var time = (new Date()).getTime() + TIME_GAP;
               producer.fetch({where:{startedAt:{condition:'<', value:time}}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 3);
                        for (var i = 0; i < results.length; i++) {
                           assert.instanceOf(results[i], LongOperationEntry);
                           assert.operator(results[i].startedAt, '<', time);
                        }
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по сравнению startedAt &gt; с сейчас - ' + (TIME_EARLIER - TIME_GAP) + 'мс)', function (done) {
               var time = (new Date()).getTime() - (TIME_EARLIER - TIME_GAP);
               producer.fetch({where:{startedAt:{condition:'>', value:time}}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 2);
                        for (var i = 0; i < results.length; i++) {
                           assert.instanceOf(results[i], LongOperationEntry);
                           assert.operator(results[i].startedAt, '>', time);
                        }
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по сравнению startedAt &gt; с сейчас - ' + (TIME_EARLIER + TIME_GAP) + 'мс)', function (done) {
               var time = (new Date()).getTime() - (TIME_EARLIER + TIME_GAP);
               producer.fetch({where:{startedAt:{condition:'>', value:time}}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 3);
                        for (var i = 0; i < results.length; i++) {
                           assert.instanceOf(results[i], LongOperationEntry);
                           assert.operator(results[i].startedAt, '>', time);
                        }
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по конкретному значению status)', function (done) {
               producer.fetch({where:{status:LongOperationEntry.STATUSES.ended}})
               .addCallback(function (results) {
                  try {
                     assert.instanceOf(results, Array);
                     assert.lengthOf(results, 1);
                     assert.instanceOf(results[0], LongOperationEntry);
                     assert.strictEqual(results[0].status, LongOperationEntry.STATUSES.ended);
                     done();
                  }
                  catch (err) {
                     done(err);
                  }
               });
            });

            it('Параметры запроса where правильно отбирают операции (по списку значений status)', function (done) {
               producer.fetch({where:{status:[LongOperationEntry.STATUSES.running, LongOperationEntry.STATUSES.suspended, 100500]}})
               .addCallback(function (results) {
                  try {
                     assert.instanceOf(results, Array);
                     assert.lengthOf(results, 2);
                     for (var i = 0; i < results.length; i++) {
                        assert.instanceOf(results[i], LongOperationEntry);
                        assert.include([LongOperationEntry.STATUSES.running, LongOperationEntry.STATUSES.suspended], results[i].status);
                     }
                     done();
                  }
                  catch (err) {
                     done(err);
                  }
               });
            });

            it('Параметры запроса where правильно отбирают операции (по значению canSuspend = true)', function (done) {
               producer.fetch({where:{canSuspend:true}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 1);
                        assert.instanceOf(results[0], LongOperationEntry);
                        assert.strictEqual(results[0].canSuspend, true);
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса where правильно отбирают операции (по значению canSuspend = false)', function (done) {
               producer.fetch({where:{canSuspend:false}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 2);
                        for (var i = 0; i < results.length; i++) {
                           assert.instanceOf(results[i], LongOperationEntry);
                           assert.strictEqual(results[i].canSuspend, false);
                        }
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса orderBy правильно сортируют операции (по title прямо)', function (done) {
               producer.fetch({orderBy:{title:true}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 3);
                        var values = results.map(function (v) { return v.title; });
                        assert.deepEqual(values, _ordered(values, true));
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса orderBy правильно сортируют операции (по title обрато)', function (done) {
               producer.fetch({orderBy:{title:false}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 3);
                        var values = results.map(function (v) { return v.title; });
                        assert.deepEqual(values, _ordered(values, false));
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса orderBy правильно сортируют операции (по startedAt прямо)', function (done) {
               producer.fetch({orderBy:{startedAt:true}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 3);
                        var values = results.map(function (v) { return v.startedAt; });
                        assert.deepEqual(values, _ordered(values, true));
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса orderBy правильно сортируют операции (по startedAt обрато)', function (done) {
               producer.fetch({orderBy:{startedAt:false}})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 3);
                        var values = results.map(function (v) { return v.startedAt; });
                        assert.deepEqual(values, _ordered(values, false));
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса orderBy правильно сортируют операции (по status прямо)', function (done) {
               producer.fetch({orderBy:{status:true}})
               .addCallback(function (results) {
                  try {
                     assert.instanceOf(results, Array);
                     assert.lengthOf(results, 3);
                     var values = results.map(function (v) { return v.status; });
                     assert.deepEqual(values, _ordered(values, true));
                     done();
                  }
                  catch (err) {
                     done(err);
                  }
               });
            });

            it('Параметры запроса orderBy правильно сортируют операции (по status обрато)', function (done) {
               producer.fetch({orderBy:{status:false}})
               .addCallback(function (results) {
                  try {
                     assert.instanceOf(results, Array);
                     assert.lengthOf(results, 3);
                     var values = results.map(function (v) { return v.status; });
                     assert.deepEqual(values, _ordered(values, false));
                     done();
                  }
                  catch (err) {
                     done(err);
                  }
               });
            });

            it('Параметр запроса offset правильно отсекают операции', function (done) {
               producer.fetch({offset:1})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 2);
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметр запроса offset правильно отсекают операции (очень большой)', function (done) {
               producer.fetch({offset:100500})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 0);
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметр запроса limit правильно отсекают операции', function (done) {
               producer.fetch({limit:1})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 1);
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });

            it('Параметры запроса offset и limit правильно отсекают операции (совместно)', function (done) {
               producer.fetch({offset:1, limit:1})
                  .addCallback(function (results) {
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 1);
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });


            //^^^ Проверить загрузку пользовательской информации из сервиса 'Персона.ПодробнаяИнформация'

            /*it('Параметры запроса extra правильно видоизменяют полученные результата', function (done) {
               producer.fetch({extra:{needUserInfo:true}})
                  .addCallback(function (results) {
                     //////////////////////////////////////////////////
                     console.log('DBG: Test_Gen: arguments.length=', arguments.length, '; arguments=', arguments, ';');
                     //////////////////////////////////////////////////
                     try {
                        assert.instanceOf(results, Array);
                        assert.lengthOf(results, 3);
                        done();
                     }
                     catch (err) {
                        done(err);
                     }
                  });
            });*/


            it('После разрушения экземпляра возвращается экземпляр Deferred с ошибкой SBIS3.CONTROLS.LongOperations.Const.ERR_UNLOAD', function (done) {
               var destroyed = _makeProducer('Под ликвидацию 1');
               destroyed.destroy();
               destroyed.fetch(null)
                  .addCallbacks(function (results) {
                     done(assert.fail('Получен результат, которого не должно быть'));
                  },
                  function (err) {
                     try {
                        assert.property(err, 'message', LongOperationsConst.ERR_UNLOAD);
                        done();
                     }
                     catch (ex2) {
                        done(ex2);
                     }
                  });
            });
         });


         describe('Метод callAction - Запросить выполнение действия с операцией', function () {
            var producer = _makeProducer(null);
            if (!producer) {
               return;
            }

            it('Аргумент action не может быть числом', function () {
               assert.throws(function () {
                  producer.callAction(1, 5);
               }, Error);
            });

            it('Аргумент action не может быть произвольной строкой', function () {
               assert.throws(function () {
                  producer.callAction('Что-то', 5);
               }, Error);
               assert.throws(function () {
                  producer.callAction('Как-то', 5);
               }, Error);
               assert.throws(function () {
                  producer.callAction('Где-то', 5);
               }, Error);
            });

            it('Аргумент action не может быть null-ём', function () {
               assert.throws(function () {
                  producer.callAction(null, 5);
               }, Error);
            });

            it('Аргумент action не может объектом', function () {
               assert.throws(function () {
                  producer.callAction({'что-то':'здесь'}, 5);
               }, Error);
            });

            it('Аргумент operationId не может быть null-ём', function () {
               assert.throws(function () {
                  producer.callAction('suspend', null);
               }, Error);
            });

            it('Аргумент operationId не может объектом', function () {
               assert.throws(function () {
                  producer.callAction('suspend', {'что-то':'здесь'});
               }, Error);
            });

            it('Аргумент action должен быть одной строкой из списка [suspend, resume, delete], аргумент operationId должен быть числом или строкой', function () {
               assert.doesNotThrow(function () {
                  producer.callAction('suspend', '0');
                  producer.callAction('resume', '0');
                  producer.callAction('delete', '0')
               }, Error);
            });

            it('Возвращаемое значение является экземпляром класса Core/Deferred', function () {
               assert.instanceOf(producer.callAction('suspend', '0'), Deferred);
            });

            it('Аргумент operationId должен быть идентификаторм существующей операции, иначе будет обещаный результат будет сразу разрешён ошибкой', function (done) {
               var suspend = new Deferred();
               producer.callAction('suspend', '0')
                  .addCallbacks(function (results) {
                     done(assert.fail('Получен результат, которого не должно быть'));
                  },
                  function (err) {
                     try {
                        assert.propertyVal(err, 'message', 'Action not found or not applicable');
                        suspend.callback();
                     }
                     catch (ex2) {
                        done(ex2);
                     }
                  });
               var resume = new Deferred();
               producer.callAction('resume', '0')
                  .addCallbacks(function (results) {
                     done(assert.fail('Получен результат, которого не должно быть'));
                  },
                  function (err) {
                     try {
                        assert.propertyVal(err, 'message', 'Action not found or not applicable');
                        resume.callback();
                     }
                     catch (ex2) {
                        done(ex2);
                     }
                  });
               var del = new Deferred();
               producer.callAction('delete', '0')
                  .addCallbacks(function (results) {
                     done(assert.fail('Получен результат, которого не должно быть'));
                  },
                  function (err) {
                     try {
                        assert.propertyVal(err, 'message', 'Operation not found');
                        del.callback();
                     }
                     catch (ex2) {
                        done(ex2);
                     }
                  });
               Promise.all([suspend, resume, del].map(_deferred2Promise)).then(function () {
                  done();
               });
            });

            it('При запросе выполнения действия если обработчика действия нет, то обещаный результат будет разрешён ошибкой', function (done) {
               var titles = ['Длительная операция 2'];
               var snapshots = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(snapshots, titles.length);
               producer.callAction('resume', snapshots[0].id)
                  .addCallbacks(function (results) {
                     done(assert.fail('Получен результат, которого не должно быть'));
                  },
                  function (err) {
                     try {
                        assert.propertyVal(err, 'message', 'Action not found or not applicable');
                        done();
                     }
                     catch (ex2) {
                        done(ex2);
                     }
                  });
            });

            /*^^^it('При запросе выполнения действия если обработчик действия есть, и он вернул false, то обещаный результат будет разрешён ошибкой', function (done) {
               var titles = ['Длительная операция 3'];
               var snapshots = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(snapshots, titles.length);
               //////////////////////////////////////////////////
               console.log('DBG: Test_Gen: snapshots=', snapshots, ';');
               //////////////////////////////////////////////////
               //^^^ Реализовать
            });*/

            /*^^^it('При запросе выполнения действия если обработчик действия есть, и он вернул true, то обещаный результат будет разрешён успешно', function (done) {
               //^^^ Реализовать
            });*/

            /*^^^it('При запросе выполнения действия если оно выполнено успешно, снимок события в локальном хранилише будет изменён или удалён', function (done) {
               //^^^ Реализовать
            });*/

            /*^^^it('При запросе выполнения действия если оно выполнено успешно, будет сформировано событие onlongoperationchanged или onlongoperationdeleted', function (done) {
               //^^^ Реализовать
            });*/

            it('После разрушения экземпляра возвращается экземпляр Deferred с ошибкой SBIS3.CONTROLS.LongOperations.Const.ERR_UNLOAD', function (done) {
               var destroyed = _makeProducer('Под ликвидацию 1');
               destroyed.destroy();
               destroyed.callAction('suspend', '0')
                  .addCallbacks(function (results) {
                        done(assert.fail('Получен результат, которого не должно быть'));
                     },
                     function (err) {
                        try {
                           assert.property(err, 'message', LongOperationsConst.ERR_UNLOAD);
                           done();
                        }
                        catch (ex2) {
                           done(ex2);
                        }
                     });
            });
         });


         //^^^ Протестировать штатное завершение операций

         //^^^ Протестировать прогресс операций


         /*describe('Метод subscribe - Подписаться на получение события', function () {
            it('000', function () {
               //^^^Реализовать
            });
         });*/


         /*describe('Метод unsubscribe - Отписаться от получения события', function () {
            it('000', function () {
               //^^^Реализовать
            });
         });*/


         describe('Метод canDestroySafely - Можно ли в данный момент ликвидировать экземпляр без потери данных', function () {
            var producer = _makeProducer(null);
            if (!producer) {
               return;
            }

            it('При ликвидации экземпляра при наличии незавершённых операций, имеющих функции действий, будут потеряны данные', function () {
               var ids = producer._actions ? Object.keys(producer._actions) : [];
               assert.strictEqual(producer.canDestroySafely(), !ids.length);
            });


            it('При ликвидации экземпляра при отстутствии незавершённых операций, имеющих функции действий, не будут потеряны данные', function () {
               var p2 = _makeProducer(null, true);
               var ids = p2._actions ? Object.keys(p2._actions) : [];
               assert.strictEqual(p2.canDestroySafely(), !ids.length);
            });
         });


         describe('Метод destroy - Ликвидировать экземпляр класса', function () {
            var producer = _makeProducer(null);
            if (!producer) {
               return;
            }

            it('При ликвидации экземпляра при наличии незавершённых операций, имеющих функции действий, они будут завершены с ошибкой SBIS3.CONTROLS.LongOperations.Const.ERR_UNLOAD', function () {
               var titles = ['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'];
               var list = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(list, titles.length);
               var ids = producer._actions ? Object.keys(producer._actions) : [];
               producer.destroy();
               var list2 = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(list2, titles.length);
               assert.deepEqual(producer._actions, {});
               for (var i = 0; i < list.length; i++) {
                  var snapshot = list[i];
                  var snapshot2 = list2[i];
                  var id = snapshot.id;
                  if (ids.indexOf('' + id) !== -1) {
                     assert.include([undefined/*LongOperationEntry.STATUSES.running*/, LongOperationEntry.STATUSES.suspended], snapshot.status || undefined);
                     assert.strictEqual(snapshot2.status, LongOperationEntry.STATUSES.ended);
                     assert.isTrue(snapshot2.isFailed);
                     assert.strictEqual(snapshot2.resultMessage, LongOperationsConst.ERR_UNLOAD);
                  }
                  else {
                     assert.deepEqual(snapshot, snapshot2);
                  }
               }
            });

            it('При ликвидации экземпляра завершаемые с ошибкой операции будут иметь корректные значения счётчиков времени', function () {
               var titles = ['Длительная операция 3'];
               var list = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(list, titles.length);
               var time = (new Date()).getTime();
               var snapshot = list[0];
               assert.closeTo(snapshot.startedAt + (snapshot.timeSpent || 0) + (snapshot.timeIdle || 0), time, TIME_RATTLING);
            });

            it('При ликвидации экземпляра при наличии незавершённых операций, имеющих функции действий, будут сформировано событие onlongoperationended', function (done) {
               var destroyed = new GenericLongOperationsProducer('Под ликвидацию 1');
               destroyed.subscribe('onlongoperationended', function (evtName, evt) {
                  try {
                     assert.isObject(evtName);
                     assert.property(evtName, 'name');
                     assert.strictEqual(evtName.name, 'onlongoperationended');
                     assert.isObject(evt);
                     assert.property(evt, 'producer');
                     assert.strictEqual(evt.producer, MODULE + ':Под ликвидацию 1');
                     assert.property(evt, 'operationIds');
                     assert.instanceOf(evt.operationIds, Array);
                     var ids = evt.operationIds;
                     var allIds = Object.keys(_lsTool.search('Под ликвидацию 1'));
                     for (var i = 0; i < ids.length; i++) {
                        var id = ids[i];
                        assert.include(allIds, '' + id);
                        assert.isNumber(id);
                        assert.equal(id%1, 0);
                        assert.operator(id, '>', 0);
                     }
                     assert.strictEqual(evt.error, LongOperationsConst.ERR_UNLOAD);
                     done();
                  }
                  catch (err) {
                     done(err);
                  }
               });
               destroyed.make({title:'Удаляемая операция', onDelete:new Function('')}, new Deferred());
               destroyed.destroy();
               _lsTool.clear('Под ликвидацию 1');
            });

            it('При ликвидации экземпляра при отстутствии незавершённых операций, имеющих функции действий, снимки операций в локальном хранилище не будут изменены', function () {
               var titles = ['Длительная операция 1', 'Длительная операция 2', 'Длительная операция 3'];
               var list = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(list, titles.length);
               var p2 = _makeProducer(null, true);
               assert.deepEqual(p2._actions, {});
               p2.destroy();
               var list2 = _byTitles(_lsTool.search(null), titles);
               assert.lengthOf(list2, titles.length);
               for (var i = 0; i < list.length; i++) {
                  assert.deepEqual(list[i], list2[i]);
               }
            });
         });
      });

   }
);
