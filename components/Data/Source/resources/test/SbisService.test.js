/* global define, describe, context, it, assert, $ws */
/* Mocking SbisServiceBLO */
define('js!SBIS3.CONTROLS.Data.Source.SbisService/resources/SbisServiceBLO', [], function () {
      'use strict';

      var existsId = 7,
         notExistsId = 99;

      var SbisServiceBLO = $ws.core.extend({}, {
         _cfg: '',
         $constructor: function (cfg) {
            this._cfg = cfg;
         },
         callMethod: function (method, args) {
            var def = new $ws.proto.Deferred(),
               meta = [
                  {'n': 'Ид', 't': 'Число целое'},
                  {'n': 'Фамилия', 't': 'Строка'},
                  {'n': 'Имя', 't': 'Строка'},
                  {'n': 'Отчество', 't': 'Строка'},
                  {'n': 'Должность', 't': 'Строка'},
                  {'n': 'В штате', 't': 'Логическое'}
               ],
               error = '',
               data;

            switch (this._cfg.name) {
               case 'Товар':
                  switch (method) {
                     case 'Создать':
                        data = {
                           d: [
                              0,
                              '',
                              '',
                              '',
                              '',
                              false
                           ],
                           s: meta
                        };
                        break;

                     case 'Прочитать':
                        if (args['ИдО'] === existsId) {
                           data = {
                              d: [
                                 existsId,
                                 'Иванов',
                                 'Иван',
                                 'Иванович',
                                 'Инженер',
                                 true
                              ],
                              s: meta
                           };
                        } else {
                           error = 'Model is not found';
                        }
                        break;

                     case 'Записать':
                        if (args['Запись'].d && args['Запись'].d[0]) {
                           data = args['Запись'].d[0];
                        } else {
                           data = 99;
                        }
                        break;

                     case 'Удалить':
                        if (args['ИдО'] === existsId) {
                           data = existsId;
                        } else {
                           error = 'Model is not found';
                        }
                        break;

                     case 'Список':
                        data = {
                           d: [
                              [
                                 existsId,
                                 'Иванов',
                                 'Иван',
                                 'Иванович',
                                 'Инженер',
                                 true
                              ],
                              [
                                 1 + existsId,
                                 'Петров',
                                 'Петр',
                                 'Петрович',
                                 'Специалист',
                                 true
                              ]
                           ],
                           s: meta
                        };
                        break;

                     case 'ВставитьДо':
                     case 'ВставитьПосле':
                        break;

                     default:
                        throw new Error('Method is undefined');
                  }
                  break;

               case 'ПорядковыйНомер':
                  switch (method) {
                     case 'ВставитьДо':
                     case 'ВставитьПосле':
                        break;
                  }
                  break;

               default:
                  error = 'Service is not found';
            }

            setTimeout(function () {
               SbisServiceBLO.lastRequest = {
                  method: method,
                  args: args
               };

               if (error) {
                  return def.errback(error);
               }

               def.callback(data);
            }.bind(this), 1);

            return def;
         }
      });

      SbisServiceBLO.lastRequest = {};
      SbisServiceBLO.existsId = existsId;
      SbisServiceBLO.notExistsId = notExistsId;

      return SbisServiceBLO;
   }
);

define([
      'js!SBIS3.CONTROLS.Data.Source.SbisService',
      'js!SBIS3.CONTROLS.Data.Source.SbisService/resources/SbisServiceBLO',
      'js!SBIS3.CONTROLS.Data.Source.DataSet',
      'js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
      'js!SBIS3.CONTROLS.Data.Query.Query'
   ], function (SbisService, SbisServiceBLO, DataSet, Model, SbisAdapter, Query) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Source.SbisService', function () {
         describe('.create()', function () {
            context('when the service is exists', function () {
               it('should return an empty model', function (done) {
                  var service = new SbisService({
                     resource: 'Товар'
                  });
                  service.create().addCallbacks(function (model) {
                     try {
                        if (!(model instanceof Model)) {
                           throw new Error('That\'s no Model');
                        }
                        if (model.isStored()) {
                           throw new Error('The model should be not stored');
                        }
                        if (model.getId()) {
                           throw new Error('The model has not empty id');
                        }
                        if (model.get('Фамилия') !== '') {
                           throw new Error('The model contains wrong data');
                        }
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a valid request', function (done) {
                  var service = new SbisService({
                     resource: 'Товар',
                     formatForRead: 'ПрочитатьФормат'
                  });
                  service.create({myParam: 'myValue'}).addCallbacks(function () {
                     try {
                        var args = SbisServiceBLO.lastRequest.args;

                        if (args['ИмяМетода'] !== 'ПрочитатьФормат') {
                           throw new Error('Wrong argument ИмяМетода');
                        }

                        if (args['Фильтр'].d[0] !== true) {
                           throw new Error('Wrong value for argument Фильтр.ВызовИзБраузера');
                        }
                        if (args['Фильтр'].s[0].n !== 'ВызовИзБраузера') {
                           throw new Error('Wrong name for argument Фильтр.ВызовИзБраузера');
                        }
                        if (args['Фильтр'].s[0].t !== 'Логическое') {
                           throw new Error('Wrong type for argument Фильтр.ВызовИзБраузера');
                        }

                        if (args['Фильтр'].d[1] !== 'myValue') {
                           throw new Error('Wrong value for argument Фильтр.myParam');
                        }
                        if (args['Фильтр'].s[1].n !== 'myParam') {
                           throw new Error('Wrong name for argument Фильтр.myParam');
                        }
                        if (args['Фильтр'].s[1].t !== 'Строка') {
                           throw new Error('Wrong type for argument Фильтр.myParam');
                        }
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });
            });

            context('when the service isn\'t exists', function () {
               it('should return an error', function (done) {
                  var service = new SbisService({
                     resource: 'Купец'
                  });
                  service.create().addBoth(function (err) {
                     if (err instanceof Error) {
                        done();
                     } else {
                        done(new Error('That\'s no Error'));
                     }
                  });
               });
            });
         });

         describe('.read()', function () {
            context('when the service is exists', function () {
               context('and the model is exists', function () {
                  it('should return valid model', function (done) {
                     var service = new SbisService({
                        resource: 'Товар'
                     });
                     service.read(SbisServiceBLO.existsId).addCallbacks(function (model) {
                        try {
                           if (!(model instanceof Model)) {
                              throw new Error('That\'s no Model');
                           }
                           if (!model.isStored()) {
                              throw new Error('The model should be stored');
                           }
                           if (!model.getId()) {
                              throw new Error('The model has empty id');
                           }
                           if (model.getId() !== SbisServiceBLO.existsId) {
                              throw new Error('The model has wrong id');
                           }
                           if (model.get('Фамилия') !== 'Иванов') {
                              throw new Error('The model contains wrong data');
                           }
                           done();
                        } catch (err) {
                           done(err);
                        }
                     }, function (err) {
                        done(err);
                     });
                  });

                  it('should generate a valid request', function (done) {
                     var service = new SbisService({
                        resource: 'Товар',
                        formatForRead: 'Формат'
                     });
                     service.read(
                        SbisServiceBLO.existsId,
                        {'ПолеОдин': 1}
                     ).addCallbacks(function () {
                        try {
                           var args = SbisServiceBLO.lastRequest.args;

                           if (args['ИмяМетода'] !== 'Формат') {
                              throw new Error('Wrong argument ИмяМетода');
                           }
                           if (args['ИдО'] !== SbisServiceBLO.existsId) {
                              throw new Error('Wrong argument ИдО');
                           }

                           if (args['ДопПоля'].d[0] !== 1) {
                              throw new Error('Wrong argument value ДопПоля.ПолеОдин');
                           }
                           if (args['ДопПоля'].s[0].n !== 'ПолеОдин') {
                              throw new Error('Wrong argument name Навигация.ПолеОдин');
                           }
                           if (args['ДопПоля'].s[0].t !== 'Число целое') {
                              throw new Error('Wrong argument type Навигация.ПолеОдин');
                           }

                           done();
                        } catch (err) {
                           done(err);
                        }
                     }, function (err) {
                        done(err);
                     });
                  });
               });

               context('and the model isn\'t exists', function () {
                  it('should return an error', function (done) {
                     var service = new SbisService({
                        resource: 'Товар'
                     });
                     service.read(SbisServiceBLO.notExistsId).addBoth(function (err) {
                        if (err instanceof Error) {
                           done();
                        } else {
                           done(new Error('That\'s no Error'));
                        }
                     });
                  });
               });
            });

            context('when the service isn\'t exists', function () {
               it('should return an error', function (done) {
                  var service = new SbisService({
                     resource: 'Купец'
                  });
                  service.read(SbisServiceBLO.existsId).addBoth(function (err) {
                     if (err instanceof Error) {
                        done();
                     } else {
                        done(new Error('That\'s no Error'));
                     }
                  });
               });
            });
         });

         describe('.update()', function () {
            context('when the service is exists', function () {
               context('and the model was stored', function () {
                  it('should update the model', function (done) {
                     var service = new SbisService({
                        resource: 'Товар'
                     });

                     service.read(SbisServiceBLO.existsId).addCallbacks(function (model) {
                        model.set('Фамилия', 'Петров');
                        service.update(model).addCallbacks(function (success) {
                           try {
                              if (!success) {
                                 throw new Error('Unsuccessful update');
                              }
                              if (!model.isChanged()) {
                                 throw new Error('The model should stay changed');
                              }
                              if (model.get('Фамилия') !== 'Петров') {
                                 throw new Error('The model contains wrong data');
                              }
                              done();
                           } catch (err) {
                              done(err);
                           }
                        }, function (err) {
                           done(err);
                        });
                     }, function (err) {
                        done(err);
                     });
                  });
               });

               var testModel = function (success, model, done) {
                  try {
                     if (!success) {
                        throw new Error('Unsuccessful update');
                     }
                     if (!model.isStored()) {
                        throw new Error('The model should become stored');
                     }
                     if (!model.isChanged()) {
                        throw new Error('The model should stay changed');
                     }
                     if (!model.getId()) {
                        throw new Error('The model should become having a id');
                     }
                     done();
                  } catch (err) {
                     done(err);
                  }
               };

               context('and the model was not stored', function () {
                  it('should create the model by 1st way', function (done) {
                     var service = new SbisService({
                        resource: 'Товар'
                     });
                     service.create().addCallbacks(function (model) {
                        service.update(model).addCallbacks(function (success) {
                           testModel(success, model, done);
                        }, function (err) {
                           done(err);
                        });
                     }, function (err) {
                        done(err);
                     });
                  });

                  it('should create the model by 2nd way', function (done) {
                     var service = new SbisService({
                           resource: 'Товар'
                        }),
                        model = new Model({
                           adapter: new SbisAdapter(),
                           data: {
                              d: [
                                 0,
                                 ''
                              ],
                              s: [
                                 {'n': 'Ид', 't': 'Число целое'},
                                 {'n': 'Фамилия', 't': 'Строка'}
                              ]
                           },
                           idProperty: 'Ид'
                        });

                     service.update(model).addCallbacks(function (success) {
                        testModel(success, model, done);
                     }, function (err) {
                        done(err);
                     });
                  });
               });

               it('should generate a valid request', function (done) {
                  var service = new SbisService({
                     resource: 'Товар',
                     formatForRead: 'Формат'
                  });
                  service.read(SbisServiceBLO.existsId).addCallbacks(function (model) {
                     var raw = model.getRaw();
                     service.update(
                        model,
                        {'ПолеОдин': '2'}
                     ).addCallbacks(function () {
                        try {
                           var args = SbisServiceBLO.lastRequest.args;

                           if (args['Запись']._type !== 'record') {
                              throw new Error('Wrong argument Запись._type');
                           }
                           if (args['Запись'].d !== raw.d) {
                              throw new Error('Wrong argument Запись.d');
                           }
                           if (args['Запись'].s !== raw.s) {
                              throw new Error('Wrong argument Запись.s');
                           }

                           if (args['ДопПоля'].d[0] !== '2') {
                              throw new Error('Wrong argument value ДопПоля.ПолеОдин');
                           }
                           if (args['ДопПоля'].s[0].n !== 'ПолеОдин') {
                              throw new Error('Wrong argument name Навигация.ПолеОдин');
                           }
                           if (args['ДопПоля'].s[0].t !== 'Строка') {
                              throw new Error('Wrong argument type Навигация.ПолеОдин');
                           }
                           done();
                        } catch (err) {
                           done(err);
                        }
                     }, function (err) {
                        done(err);
                     });
                  }, function (err) {
                     done(err);
                  });
               });
            });

            context('when the service isn\'t exists', function () {
               it('should return an error', function (done) {
                  new SbisService({
                     resource: 'Товар'
                  }).create().addCallbacks(function (model) {
                        var service = new SbisService({
                           resource: 'Купец'
                        });
                        service.update(model).addBoth(function (err) {
                           if (err instanceof Error) {
                              done();
                           } else {
                              done(new Error('That\'s no Error'));
                           }
                        });
                     }, function (err) {
                        done(err);
                     });
               });
            });
         });

         describe('.destroy()', function () {
            context('when the service is exists', function () {
               context('and the model is exists', function () {
                  it('should return success', function (done) {
                     var service = new SbisService({
                        resource: 'Товар'
                     });
                     service.destroy(SbisServiceBLO.existsId).addCallbacks(function (success) {
                        try {
                           if (!success) {
                              throw new Error('Unsuccessful destroy');
                           } else {
                              done();
                           }
                        } catch (err) {
                           done(err);
                        }
                     }, function (err) {
                        done(err);
                     });
                  });
               });

               context('and the model isn\'t exists', function () {
                  it('should return an error', function (done) {
                     var service = new SbisService({
                        resource: 'Товар'
                     });
                     service.destroy(SbisServiceBLO.notExistsId).addBoth(function (err) {
                        if (err instanceof Error) {
                           done();
                        } else {
                           done(new Error('That\'s no Error'));
                        }
                     });
                  });
               });

               it('should generate a valid request', function (done) {
                  var service = new SbisService({
                     resource: 'Товар'
                  });
                  service.destroy(
                     SbisServiceBLO.existsId,
                     {'ПолеОдин': true}
                  ).addCallbacks(function () {
                     try {
                        var args = SbisServiceBLO.lastRequest.args;

                        if (args['ИдО'] !== SbisServiceBLO.existsId) {
                           throw new Error('Wrong argument ИдО');
                        }

                        if (args['ДопПоля'].d[0] !== true) {
                           throw new Error('Wrong argument value ДопПоля.ПолеОдин');
                        }
                        if (args['ДопПоля'].s[0].n !== 'ПолеОдин') {
                           throw new Error('Wrong argument name Навигация.ПолеОдин');
                        }
                        if (args['ДопПоля'].s[0].t !== 'Логическое') {
                           throw new Error('Wrong argument type Навигация.ПолеОдин');
                        }
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });
            });

            context('when the service isn\'t exists', function () {
               it('should return an error', function (done) {
                  var service = new SbisService({
                     resource: 'Купец'
                  });
                  service.destroy(SbisServiceBLO.existsId).addBoth(function (err) {
                     if (err instanceof Error) {
                        done();
                     } else {
                        done(new Error('That\'s no Error'));
                     }
                  });
               });
            });
         });

         describe('.query()', function () {
            context('when the service is exists', function () {
               it('should return a valid dataset', function (done) {
                  var service = new SbisService({
                     resource: 'Товар'
                  });
                  service.query(new Query()).addCallbacks(function (ds) {
                     try {
                        if (!(ds instanceof DataSet)) {
                           throw new Error('That\'s no dataset');
                        }
                        if (ds.getAll().getCount() !== 2) {
                           throw new Error('Wrong models count');
                        }
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should work with no query', function (done) {
                  var service = new SbisService({
                     resource: 'Товар'
                  });
                  service.query().addCallbacks(function (ds) {
                     try {
                        if (!(ds instanceof DataSet)) {
                           throw new Error('That\'s no dataset');
                        }
                        if (ds.getAll().getCount() !== 2) {
                           throw new Error('Wrong models count');
                        }
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a valid request', function (done) {
                  var service = new SbisService({
                        resource: 'Товар'
                     }),
                     query = new Query();
                  query
                     .select(['fieldOne', 'fieldTwo'])
                     .from('Goods')
                     .where({
                        id: 5,
                        enabled: true,
                        title: 'abc*'
                     })
                     .orderBy({
                        id: true,
                        enabled: false
                     })
                     .offset(100)
                     .limit(33)
                     .meta({
                        'ПолеОдин': 4
                     });

                  service.query(query).addCallbacks(function () {
                        try {
                           var args = SbisServiceBLO.lastRequest.args;

                           if (args['Фильтр'].d[0] !== 5) {
                              throw new Error('Wrong argument value Фильтр.id');
                           }
                           if (args['Фильтр'].s[0].n !== 'id') {
                              throw new Error('Wrong argument name Фильтр.id');
                           }
                           if (args['Фильтр'].s[0].t !== 'Число целое') {
                              throw new Error('Wrong argument type Фильтр.id');
                           }

                           if (args['Фильтр'].d[1] !== true) {
                              throw new Error('Wrong argument value Фильтр.enabled');
                           }
                           if (args['Фильтр'].s[1].n !== 'enabled') {
                              throw new Error('Wrong argument name Фильтр.enabled');
                           }
                           if (args['Фильтр'].s[1].t !== 'Логическое') {
                              throw new Error('Wrong argument type Фильтр.enabled');
                           }

                           if (args['Фильтр'].d[2] !== 'abc*') {
                              throw new Error('Wrong argument value Фильтр.title');
                           }
                           if (args['Фильтр'].s[2].n !== 'title') {
                              throw new Error('Wrong argument name Фильтр.title');
                           }
                           if (args['Фильтр'].s[2].t !== 'Строка') {
                              throw new Error('Wrong argument type Фильтр.title');
                           }

                           if (args['Сортировка'].d[0][0] !== 'id') {
                              throw new Error('Wrong argument value Сортировка.id.n');
                           }
                           if (args['Сортировка'].d[0][1] !== true) {
                              throw new Error('Wrong argument value Сортировка.id.o');
                           }
                           if (args['Сортировка'].d[0][2] !== false) {
                              throw new Error('Wrong argument value Сортировка.id.l');
                           }

                           if (args['Сортировка'].d[1][0] !== 'enabled') {
                              throw new Error('Wrong argument value Сортировка.enabled.n');
                           }
                           if (args['Сортировка'].d[1][1] !== false) {
                              throw new Error('Wrong argument value Сортировка.enabled.o');
                           }
                           if (args['Сортировка'].d[1][2] !== true) {
                              throw new Error('Wrong argument value Сортировка.enabled.l');
                           }

                           if (args['Сортировка'].s[0].n !== 'n') {
                              throw new Error('Wrong argument name Сортировка.n');
                           }
                           if (args['Сортировка'].s[1].n !== 'o') {
                              throw new Error('Wrong argument name Сортировка.o');
                           }
                           if (args['Сортировка'].s[2].n !== 'l') {
                              throw new Error('Wrong argument name Сортировка.l');
                           }

                           if (args['Навигация'].d[0] !== 3) {
                              throw new Error('Wrong argument value Навигация.Страница');
                           }
                           if (args['Навигация'].s[0].n !== 'Страница') {
                              throw new Error('Wrong argument name Навигация.Страница');
                           }

                           if (args['Навигация'].d[1] !== 33) {
                              throw new Error('Wrong argument value Навигация.РазмерСтраницы');
                           }
                           if (args['Навигация'].s[1].n !== 'РазмерСтраницы') {
                              throw new Error('Wrong argument name Навигация.РазмерСтраницы');
                           }

                           if (args['Навигация'].d[2] !== true) {
                              throw new Error('Wrong argument value Навигация.ЕстьЕще');
                           }
                           if (args['Навигация'].s[2].n !== 'ЕстьЕще') {
                              throw new Error('Wrong argument name Навигация.ЕстьЕще');
                           }

                           if (args['ДопПоля'].d[0] !== 4) {
                              throw new Error('Wrong argument value ДопПоля.ПолеОдин');
                           }
                           if (args['ДопПоля'].s[0].n !== 'ПолеОдин') {
                              throw new Error('Wrong argument name Навигация.ПолеОдин');
                           }
                           if (args['ДопПоля'].s[0].t !== 'Число целое') {
                              throw new Error('Wrong argument type Навигация.ПолеОдин');
                           }

                           done();
                        } catch (err) {
                           done(err);
                        }
                     }, function (err) {
                        done(err);
                     });
               });
            });

            context('when the service isn\'t exists', function () {
               it('should return an error', function (done) {
                  var service = new SbisService({
                     resource: 'Купец'
                  });
                  service.query(new Query()).addBoth(function (err) {
                     if (err instanceof Error) {
                        done();
                     } else {
                        done(new Error('That\'s no Error'));
                     }
                  });
               });
            });
         });

         describe('.move()', function () {
            it('should move ' + SbisServiceBLO.existsId + ' before ' + 56, function (done) {
               var service = new SbisService({
                  resource: 'Товар'
               });
               service.read(SbisServiceBLO.existsId).addCallback(function (model) {
                  service.move(model, 56).addCallbacks(function() {
                     var args = SbisServiceBLO.lastRequest.args;
                     if (Array.indexOf(args['ИдО'], SbisServiceBLO.existsId) !== -1 &&
                        Array.indexOf(args['ИдОДо'], 56) !== -1 &&
                        args['ПорядковыйНомер'] === 'ПорНомер'
                     ) {
                        done();
                     } else {
                        done(new Error('Unexpected value'));
                     }
                  }, function(err){
                     done(err);
                  });
               });
            });

            it('should move ' + SbisServiceBLO.existsId + ' before ' + 0, function (done) {
               var service = new SbisService({
                  resource: 'Товар'
               });
               service.read(SbisServiceBLO.existsId).addCallback(function (model) {
                  service.move(model, 0).addCallbacks(function() {
                     var args = SbisServiceBLO.lastRequest.args;
                     if (Array.indexOf(args['ИдО'], SbisServiceBLO.existsId) !== -1 &&
                        Array.indexOf(args['ИдОДо'], 0) !== -1  &&
                        args['ПорядковыйНомер'] === 'ПорНомер'
                     ) {
                        done();
                     } else {
                        done(new Error('Unexpected value'));
                     }
                  }, function(err){
                     done(err);
                  });
               });
            });

            it('should move ' + SbisServiceBLO.existsId + ' after ' + 77, function (done) {
               var service = new SbisService({
                  resource: 'Товар'
               });
               service.read(SbisServiceBLO.existsId).addCallback(function (model) {
                  service.move(model, 77, {after: true}).addCallbacks(function() {
                     var args = SbisServiceBLO.lastRequest.args;
                     if (Array.indexOf(args['ИдО'], SbisServiceBLO.existsId) !== -1 &&
                        Array.indexOf(args['ИдОПосле'], 77) !== -1  &&
                        args['ПорядковыйНомер'] === 'ПорНомер'
                     ) {
                        done();
                     } else {
                        done(new Error('Unexpected value'));
                     }
                  }, function(err){
                     done(err);
                  });
               });
            });

            it('should move ' + SbisServiceBLO.existsId + ' after ' + 0, function (done) {
               var service = new SbisService({
                  resource: 'Товар'
               });
               service.read(SbisServiceBLO.existsId).addCallback(function (model) {
                  service.move(model, 0, {after: true}).addCallbacks(function() {
                     var args = SbisServiceBLO.lastRequest.args;
                     if (Array.indexOf(args['ИдО'], SbisServiceBLO.existsId) !== -1 &&
                        Array.indexOf(args['ИдОПосле'], 0) !== -1  &&
                        args['ПорядковыйНомер'] === 'ПорНомер'
                     ) {
                        done();
                     } else {
                        done(new Error('Unexpected value'));
                     }
                  }, function(err){
                     done(err);
                  });
               });
            });

            it('should generate a valid request', function (done) {
               var service = new SbisService({
                  resource: 'Товар'
               });
               service.read(SbisServiceBLO.existsId).addCallback(function (model) {
                  service.move(model, 56, {column: 'Название'}).addCallbacks(function() {
                     var args = SbisServiceBLO.lastRequest.args;
                     if (args['ПорядковыйНомер'] === 'Название') {
                        done();
                     } else {
                        done(new Error('Unexpected value'));
                     }
                  }, function(err){
                     done(err);
                  });
               });
            });
         });
      });
   }
);
