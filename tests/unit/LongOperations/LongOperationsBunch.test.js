/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.LongOperationsBunch'
   ],

   function (LongOperationsBunch) {
      'use strict';

      if (typeof mocha !== 'undefined') {
         mocha.setup({/*ignoreLeaks:true,*/ globals:[/*'*',*/ '__extends', 'sharedBusDebug']});
      }

      // Попробовать создать новый экземпляр
      var _makeBunch = function () {
         var bunch;
         try {
            bunch = new LongOperationsBunch();
         }
         catch (ex) {
            it('Невозможно создать экземпляр', function () {
               assert.ifError(ex);
            });
         }
         return bunch;
      };

      // Заполнить экземпляр данными для тестирования
      var _fillBunch = function (bunch) {
         if (bunch) {
            bunch.set({'свойство':'Величина', 'группа':'Общая'}, 'Значение');
            bunch.set({'свойство':'Другая величина', 'группа':'Общая'}, 'Другое значение');
            bunch.set({'свойство':'Третья величина', 'группа':null}, 'Третье значение');
         }
         return bunch;
      };


      describe('LongOperations: LongOperationsBunch', function () {

         describe('Создание экземпляра и API', function () {
            var bunch = _makeBunch();
            if (!bunch) {
               return;
            }

            it('Создание экземпляра', function () {
               assert.instanceOf(bunch, LongOperationsBunch);
            });

            var signatures = {
               set: 2,
               get: 1,
               getId: 1,
               getById: 1,
               list: 1,
               listIds: 1,
               listByIds: 1,
               search: 2,
               searchIds: 1,
               remove: 1,
               removeById: 1,
               removeAll: 2
            };
            Object.keys(signatures).forEach(function (method) {
               var len = signatures[method];
               it('Метод экземпляра ' + method + ' (' + len + ')', function () {
                  var f = bunch[method];
                  assert.isFunction(f, 'Метод отсутствует');
                  if (typeof f === 'function') {
                     assert.equal(f.length, len, 'Количество аргументов');
                  }
               });
            });
         });


         describe('Метод set - Установка хранящихся значений', function () {
            var bunch = _makeBunch();
            if (!bunch) {
               return;
            }

            it('Ключ не может быть числом', function () {
               assert.throws(function () {
                  var id = bunch.set(1, 'Значение');
               }, TypeError);
            });

            it('Ключ не может быть строкой', function () {
               assert.throws(function () {
                  var id = bunch.set('Ключ', 'Значение');
               }, TypeError);
            });

            it('Ключ не может быть null-ём', function () {
               assert.throws(function () {
                  var id = bunch.set(null, 'Значение');
               }, TypeError);
            });

            var id1, id2, id3;
            it('Ключ должен быть объектом', function () {
               assert.doesNotThrow(function () {
                  id1 = bunch.set({'свойство':'Величина', 'группа':'Общая'}, 'Значение');
                  id2 = bunch.set({'свойство':'Другая величина', 'группа':'Общая'}, 'Другое значение');
                  id3 = bunch.set({'свойство':'Третья величина', 'группа':null}, 'Третье значение');
               }, Error);
            });

            it('Возвращается числовой положительный идентификатор', function () {
               assert.isNumber(id1);
               assert.equal(id1%1, 0);
               assert.operator(id1, '>', 0);
               assert.isNumber(id2);
               assert.equal(id2%1, 0);
               assert.operator(id2, '>', 0);
               assert.isNumber(id3);
               assert.equal(id3%1, 0);
               assert.operator(id3, '>', 0);
            });

            it('При каждой установке новый идентификатор', function () {
               assert.notEqual(id1, id2);
               assert.notEqual(id2, id3);
               assert.notEqual(id3, id1);
            });
         });


         describe('Метод get - Получение хранящихся значений по ключу', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Ключ не может быть числом', function () {
               assert.throws(function () {
                  bunch.get(1);
               }, TypeError);
            });

            it('Ключ не может быть строкой', function () {
               assert.throws(function () {
                  bunch.get('Ключ');
               }, TypeError);
            });

            it('Ключ не может быть null-ём', function () {
               assert.throws(function () {
                  bunch.get(null);
               }, TypeError);
            });

            var value1, value2, value3, value4;
            it('Ключ должен быть объектом', function () {
               assert.doesNotThrow(function () {
                  value1 = bunch.get({'свойство':'Величина', 'группа':'Общая'});
                  value2 = bunch.get({'свойство':'Другая величина', 'группа':'Общая'});
                  value3 = bunch.get({'свойство':'Третья величина', 'группа':null});
                  value4 = bunch.get({'свойство':'Пусто', 'группа':'Не знаю'});
               }, Error);
            });

            it('Получены правильные хранящиеся значения', function () {
               assert.strictEqual(value1, 'Значение');
               assert.strictEqual(value2, 'Другое значение');
               assert.strictEqual(value3, 'Третье значение');
               assert.equal(value4, null);
            });
         });


         describe('Метод getId - Получение идентификаторов по ключу', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Ключ не может быть числом', function () {
               assert.throws(function () {
                  bunch.getId(1);
               }, TypeError);
            });

            it('Ключ не может быть строкой', function () {
               assert.throws(function () {
                  bunch.getId('Ключ');
               }, TypeError);
            });

            it('Ключ не может быть null-ём', function () {
               assert.throws(function () {
                  bunch.getId(null);
               }, TypeError);
            });

            var id1, id2, id3, id4;
            it('Ключ должен быть объектом', function () {
               assert.doesNotThrow(function () {
                  id1 = bunch.getId({'свойство':'Величина', 'группа':'Общая'});
                  id2 = bunch.getId({'свойство':'Другая величина', 'группа':'Общая'});
                  id3 = bunch.getId({'свойство':'Третья величина', 'группа':null});
                  id4 = bunch.getId({'свойство':'Пусто', 'группа':'Не знаю'});
               }, Error);
            });

            it('Получены правильные идентификаторы', function () {
               assert.strictEqual(id1, 1);
               assert.strictEqual(id2, 2);
               assert.strictEqual(id3, 3);
               assert.equal(id4, null);
            });
         });


         describe('Метод getById - Получение хранящихся значений по идентификаторам', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Идентификатор не может быть объектом', function () {
               assert.throws(function () {
                  bunch.getById({'что-то':'здесь'});
               }, TypeError);
            });

            it('Идентификатор не может быть строкой', function () {
               assert.throws(function () {
                  bunch.getById('1');
               }, TypeError);
            });

            it('Идентификатор не может быть null-ём', function () {
               assert.throws(function () {
                  bunch.getById(null);
               }, TypeError);
            });

            var value1, value2, value3, value4;
            it('Идентификатор должен быть числом', function () {
               assert.doesNotThrow(function () {
                  value1 = bunch.getById(1);
                  value2 = bunch.getById(2);
                  value3 = bunch.getById(3);
                  value4 = bunch.getById(4);
               }, Error);
            });

            it('Получены правильные хранящиеся значения', function () {
               assert.strictEqual(value1, 'Значение');
               assert.strictEqual(value2, 'Другое значение');
               assert.strictEqual(value3, 'Третье значение');
               assert.equal(value4, null);
            });
         });


         describe('Метод list - Получение списка хранящихся значений по списку ключей', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Список ключей не может быть числом', function () {
               assert.throws(function () {
                  bunch.list(1);
               }, TypeError);
            });

            it('Список ключей не может быть строкой', function () {
               assert.throws(function () {
                  bunch.list('Что-то');
               }, TypeError);
            });

            it('Список ключей не может быть объектом', function () {
               assert.throws(function () {
                  bunch.list({'что-то':'здесь'});
               }, TypeError);
            });

            it('Список ключей не может быть null-ём', function () {
               assert.throws(function () {
                  bunch.list(null);
               }, TypeError);
            });

            var values;
            it('Список ключей должен быть массивом объектов', function () {
               assert.doesNotThrow(function () {
                  values = bunch.list([
                     {'свойство':'Величина', 'группа':'Общая'},
                     {'свойство':'Другая величина', 'группа':'Общая'},
                     {'свойство':'Третья величина', 'группа':null},
                     {'свойство':'Пусто', 'группа':'Не знаю'}
                  ]);
               }, Error);
            });

            it('Получен правильный список хранящихся значений', function () {
               assert.isArray(values);
               assert.lengthOf(values, 4);
               assert.strictEqual(values[0], 'Значение');
               assert.strictEqual(values[1], 'Другое значение');
               assert.strictEqual(values[2], 'Третье значение');
               assert.equal(values[4], null);
            });
         });


         describe('Метод listIds - Получение списка идентификаторов по списку ключей', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Список ключей не может быть числом', function () {
               assert.throws(function () {
                  bunch.listIds(1);
               }, TypeError);
            });

            it('Список ключей не может быть строкой', function () {
               assert.throws(function () {
                  bunch.listIds('Что-то');
               }, TypeError);
            });

            it('Список ключей не может быть объектом', function () {
               assert.throws(function () {
                  bunch.listIds({'что-то':'здесь'});
               }, TypeError);
            });

            it('Список ключей не может быть null-ём', function () {
               assert.throws(function () {
                  bunch.listIds(null);
               }, TypeError);
            });

            var ids;
            it('Список ключей должен быть массивом объектов', function () {
               assert.doesNotThrow(function () {
                  ids = bunch.listIds([
                     {'свойство':'Величина', 'группа':'Общая'},
                     {'свойство':'Другая величина', 'группа':'Общая'},
                     {'свойство':'Третья величина', 'группа':null},
                     {'свойство':'Пусто', 'группа':'Не знаю'}
                  ]);
               }, Error);
            });

            it('Получен правильный список идентификаторов', function () {
               assert.isArray(ids);
               assert.lengthOf(ids, 4);
               assert.strictEqual(ids[0], 1);
               assert.strictEqual(ids[1], 2);
               assert.strictEqual(ids[2], 3);
               assert.equal(ids[4], null);
            });
         });


         describe('Метод listByIds - Получение списка хранящихся значений по списку идентификаторов', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Список идентификаторов не может быть числом', function () {
               assert.throws(function () {
                  bunch.listByIds(1);
               }, TypeError);
            });

            it('Список идентификаторов не может быть строкой', function () {
               assert.throws(function () {
                  bunch.listByIds('1');
               }, TypeError);
            });

            it('Список идентификаторов не может быть объектом', function () {
               assert.throws(function () {
                  bunch.listByIds({'что-то':'здесь'});
               }, TypeError);
            });

            it('Список идентификаторов не может быть null-ём', function () {
               assert.throws(function () {
                  bunch.listByIds(null);
               }, TypeError);
            });

            var values;
            it('Список идентификаторов должен быть массивом чисел', function () {
               assert.doesNotThrow(function () {
                  values = bunch.listByIds([1, 2, 3, 4]);
               }, Error);
            });

            it('Получен правильный список хранящихся значений', function () {
               assert.isArray(values);
               assert.lengthOf(values, 4);
               assert.strictEqual(values[0], 'Значение');
               assert.strictEqual(values[1], 'Другое значение');
               assert.strictEqual(values[2], 'Третье значение');
               assert.equal(values[4], null);
            });
         });


         describe('Метод search - Поиск хранящихся значений по заданным критериям', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Критерии поиска не могут быть числом', function () {
               assert.throws(function () {
                  bunch.search(1, [1]);
               }, TypeError);
            });

            it('Критерии поиска не могут быть строкой', function () {
               assert.throws(function () {
                  bunch.search('Что-то', [1]);
               }, TypeError);
            });

            it('Список идентификаторов не может быть числом', function () {
               assert.throws(function () {
                  bunch.search({'что-то':'здесь'}, 1);
               }, TypeError);
            });

            it('Список идентификаторов не может быть строкой', function () {
               assert.throws(function () {
                  bunch.search({'что-то':'здесь'}, 'Что-то');
               }, TypeError);
            });

            var results1, results2, results3, results4, results5, results6, results7;
            it('Критерии поиска должны быть объектом или null-ём, cписок идентификаторов должен быть списком чисел или null-ём', function () {
               assert.doesNotThrow(function () {
                  results1 = bunch.search(null, null);
                  results2 = bunch.search({'группа':'Общая'}, null);
                  results3 = bunch.search(null, [1, 3]);
                  results4 = bunch.search({'группа':'Общая'}, [1, 3]);
                  results5 = bunch.search({'группа':'Общая'}, [4]);
                  results6 = bunch.search({'группа':null}, null);
                  results7 = bunch.search({'группа':'Левая'}, [1, 2, 3]);
               }, Error);
            });

            it('Получены правильные хранящиеся значения', function () {
               assert.deepEqual(results1, ['Значение', 'Другое значение', 'Третье значение']);
               assert.deepEqual(results2, ['Значение', 'Другое значение']);
               assert.deepEqual(results3, ['Значение', 'Третье значение']);
               assert.deepEqual(results4, ['Значение']);
               assert.deepEqual(results5, []);
               assert.deepEqual(results6, ['Третье значение']);
               assert.deepEqual(results7, []);
            });
         });


         describe('Метод searchIds - Поиск идентификаторов по заданным критериям', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Критерии поиска не могут быть числом', function () {
               assert.throws(function () {
                  bunch.searchIds(1, [1]);
               }, TypeError);
            });

            it('Критерии поиска не могут быть строкой', function () {
               assert.throws(function () {
                  bunch.searchIds('Что-то', [1]);
               }, TypeError);
            });

            var results1, results2, results3, results4;
            it('Критерии поиска должны быть объектом или null-ём', function () {
               assert.doesNotThrow(function () {
                  results1 = bunch.searchIds(null);
                  results2 = bunch.searchIds({'группа':'Общая'});
                  results3 = bunch.searchIds({'группа':null});
                  results4 = bunch.searchIds({'группа':'Левая'});
               }, Error);
            });

            it('Получены правильные идентификаторы', function () {
               assert.deepEqual(results1, [1, 2, 3]);
               assert.deepEqual(results2, [1, 2]);
               assert.deepEqual(results3, [3]);
               assert.deepEqual(results4, []);
            });
         });


         describe('Метод remove - Удаление хранящихся значений по ключу', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Ключ не может быть числом', function () {
               assert.throws(function () {
                  var id = bunch.remove(1, 'Значение');
               }, TypeError);
            });

            it('Ключ не может быть строкой', function () {
               assert.throws(function () {
                  var id = bunch.remove('Ключ', 'Значение');
               }, TypeError);
            });

            it('Ключ не может быть null-ём', function () {
               assert.throws(function () {
                  var id = bunch.remove(null, 'Значение');
               }, TypeError);
            });

            var value1, value2, value3, value4;
            it('Ключ должен быть объектом', function () {
               assert.doesNotThrow(function () {
                  value1 = bunch.remove({'свойство':'Величина', 'группа':'Общая'});
                  value2 = bunch.remove({'свойство':'Другая величина', 'группа':'Общая'});
                  value3 = bunch.remove({'свойство':'Третья величина', 'группа':null});
                  value4 = bunch.remove({'что-то':'здесь'});
               }, Error);
            });

            it('Возвращены правильные хранящиеся значения', function () {
               assert.strictEqual(value1, 'Значение');
               assert.strictEqual(value2, 'Другое значение');
               assert.strictEqual(value3, 'Третье значение');
               assert.equal(value4, null);
            });
         });


         describe('Метод removeById - Удаление хранящихся значений по идентификатору', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Идентификатор не может быть объектом', function () {
               assert.throws(function () {
                  bunch.removeById({'что-то':'здесь'});
               }, TypeError);
            });

            it('Идентификатор не может быть строкой', function () {
               assert.throws(function () {
                  bunch.removeById('1');
               }, TypeError);
            });

            it('Идентификатор не может быть null-ём', function () {
               assert.throws(function () {
                  bunch.removeById(null);
               }, TypeError);
            });

            var value1, value2, value3, value4;
            it('Идентификатор должен быть числом', function () {
               assert.doesNotThrow(function () {
                  value1 = bunch.removeById(1);
                  value2 = bunch.removeById(2);
                  value3 = bunch.removeById(3);
                  value4 = bunch.removeById(4);
               }, Error);
            });

            it('Возвращены правильные хранящиеся значения', function () {
               assert.strictEqual(value1, 'Значение');
               assert.strictEqual(value2, 'Другое значение');
               assert.strictEqual(value3, 'Третье значение');
               assert.equal(value4, null);
            });
         });


         describe('Метод removeAll - Удаление хранящихся значений по заданным критериям', function () {
            var bunch = _fillBunch(_makeBunch());
            if (!bunch) {
               return;
            }

            it('Критерии удаления не могут быть числом', function () {
               assert.throws(function () {
                  bunch.removeAll(1, [1]);
               }, TypeError);
            });

            it('Критерии удаления не могут быть строкой', function () {
               assert.throws(function () {
                  bunch.removeAll('Что-то', [1]);
               }, TypeError);
            });

            it('Список идентификаторов не может быть числом', function () {
               assert.throws(function () {
                  bunch.removeAll({'что-то':'здесь'}, 1);
               }, TypeError);
            });

            it('Список идентификаторов не может быть строкой', function () {
               assert.throws(function () {
                  bunch.removeAll({'что-то':'здесь'}, 'Что-то');
               }, TypeError);
            });

            var deleted1, deleted2, deleted3, deleted4, deleted5, deleted6, deleted7;
            it('Критерии удаления должны быть объектом или null-ём, cписок идентификаторов должен быть списком чисел или null-ём', function () {
               assert.doesNotThrow(function () {
                  deleted1 = bunch.removeAll(null, null);
                  deleted2 = _fillBunch(_makeBunch()).removeAll({'группа':'Общая'}, null);
                  deleted3 = _fillBunch(_makeBunch()).removeAll(null, [1, 3]);
                  deleted4 = _fillBunch(_makeBunch()).removeAll({'группа':'Общая'}, [1, 3]);
                  deleted5 = _fillBunch(_makeBunch()).removeAll({'группа':'Общая'}, [4]);
                  deleted6 = _fillBunch(_makeBunch()).removeAll({'группа':null}, null);
                  deleted7 = _fillBunch(_makeBunch()).removeAll({'группа':'Левая'}, [1, 2, 3]);
               }, Error);
            });

            it('Получены правильные удаленные значения', function () {
               assert.deepEqual(deleted1, ['Значение', 'Другое значение', 'Третье значение']);
               assert.deepEqual(deleted2, ['Значение', 'Другое значение']);
               assert.deepEqual(deleted3, ['Значение', 'Третье значение']);
               assert.deepEqual(deleted4, ['Значение']);
               assert.deepEqual(deleted5, []);
               assert.deepEqual(deleted6, ['Третье значение']);
               assert.deepEqual(deleted7, []);
            });
         });
      });
   }
);
