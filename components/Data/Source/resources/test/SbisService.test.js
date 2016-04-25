/* global define, describe, context, beforeEach, afterEach, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.Data.Source.SbisService',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Source.Provider.IRpc',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Collection.List',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Query.Query'
], function (SbisService, Di, IRpc, DataSet, Model, RecordSet, List, SbisAdapter, Query) {
      'use strict';

      //Mock of SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic
      var SbisBusinessLogic = (function() {
         var lastId = 0,
            existsId = 7,
            existsTooId = 987,
            notExistsId = 99,
            textId = 'uuid';

         var Mock = $ws.core.extend({}, [IRpc], {
            _cfg: {},
            $constructor: function (cfg) {
               this._cfg = cfg;
            },
            call: function (method, args) {
               var def = new $ws.proto.Deferred(),
                  meta = [
                     {'n': 'Фамилия', 't': 'Строка'},
                     {'n': 'Имя', 't': 'Строка'},
                     {'n': 'Отчество', 't': 'Строка'},
                     {'n': '@Ид', 't': 'Число целое'},
                     {'n': 'Должность', 't': 'Строка'},
                     {'n': 'В штате', 't': 'Логическое'}
                  ],
                  idPosition = 3,
                  error = '',
                  data;

               switch (this._cfg.endpoint.contract) {
                  case 'Товар':
                  case 'Продукт':
                     switch (method) {
                        case 'Создать':
                           data = {
                              d: [
                                 '',
                                 '',
                                 '',
                                 ++lastId,
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
                                    'Иванов',
                                    'Иван',
                                    'Иванович',
                                    existsId,
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
                           if (args['Запись'].d && args['Запись'].d[idPosition]) {
                              data = args['Запись'].d[idPosition];
                           } else {
                              data = 99;
                           }
                           break;

                        case 'Удалить':
                           if (args['ИдО'] === existsId ||
                              Array.indexOf(args['ИдО'], String(existsId)) !== -1
                           ) {
                              data = existsId;
                           } else if (args['ИдО'] === textId ||
                              Array.indexOf(args['ИдО'], String(textId)) !== -1
                           ) {
                              data = textId;
                           } else if (args['ИдО'] === existsTooId ||
                              Array.indexOf(args['ИдО'], String(existsTooId)) !== -1
                           ) {
                              data = existsTooId;
                           } else {
                              error = 'Model is not found';
                           }
                           break;

                        case 'Список':
                           data = {
                              d: [
                                 [
                                    'Иванов',
                                    'Иван',
                                    'Иванович',
                                    existsId,
                                    'Инженер',
                                    true
                                 ],
                                 [
                                    'Петров',
                                    'Петр',
                                    'Петрович',
                                    1 + existsId,
                                    'Специалист',
                                    true
                                 ]
                              ],
                              s: meta
                           };
                           break;

                        case 'ВставитьДо':
                        case 'ВставитьПосле':
                        case 'Произвольный':
                           break;

                        default:
                           error = 'Method "' + method + '" is undefined';
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
                     error = 'Contract "' + this._cfg.endpoint.contract + '" is not found';
               }

               setTimeout(function () {
                  Mock.lastRequest = {
                     cfg: this._cfg,
                     method: method,
                     args: args
                  };

                  if (error) {
                     return def.errback(error);
                  }

                  def.callback(data);
               }.bind(this), 0);

               return def;
            }
         });

         Mock.lastRequest = {};
         Mock.existsId = existsId;
         Mock.notExistsId = notExistsId;

         return Mock;
      })();

      describe('SBIS3.CONTROLS.Data.Source.SbisService', function () {
         var getSampleModel = function() {
               var model = new Model({
                  adapter: 'adapter.sbis',
                  idProperty: '@Ид'
               });
               model.addField({name: '@Ид', type: 'integer'}, undefined, 1);
               model.addField({name: 'Фамилия', type: 'string'}, undefined, 'tst');

               return model;
            },
            getSampleMeta = function() {
               return {
                  a: 1,
                  b: 2,
                  c: 3
               };
            },
            testArgIsModel = function(arg, model) {
               assert.strictEqual(arg._type, 'record');
               assert.deepEqual(arg.d, model.getRawData().d);
               assert.deepEqual(arg.s, model.getRawData().s);
            },
            testArgIsDataSet = function(arg, dataSet) {
               assert.strictEqual(arg._type, 'recordset');
               assert.deepEqual(arg.d, dataSet.getRawData().d);
               assert.deepEqual(arg.s, dataSet.getRawData().s);
            },
            service;

         beforeEach(function() {
            //Replace of standard with mock
            Di.register('source.provider.sbis-business-logic', SbisBusinessLogic);

            service = new SbisService({
               endpoint: 'Товар'
            });
         });

         afterEach(function () {
            service = undefined;
         });

         describe('.$constructor', function () {
            context('when use deprecated options', function () {
               it('should use string "service" option without "resource" option as "endpoint.contract"', function () {
                  var contract = 'Users',
                     service = new SbisService({
                        service: contract
                     });
                  assert.strictEqual(service.getEndpoint().contract, contract);
                  assert.isUndefined(service.getEndpoint().address);
                  assert.strictEqual(service.getResource(), contract);
                  assert.strictEqual(service.getService(), '');
               });

               it('should use object "service" option without "resource" option as "endpoint.contract" and "endpoint.address"', function () {
                  var contract = 'Users',
                     address = '/users/',
                     service = new SbisService({
                        service: {
                           name: contract
                        }
                     });
                  assert.strictEqual(service.getEndpoint().contract, contract);
                  assert.isUndefined(service.getEndpoint().address);
                  assert.strictEqual(service.getResource(), contract);
                  assert.strictEqual(service.getService(), '');

                  service = new SbisService({
                     service: {
                        name: contract,
                        serviceUrl: address
                     }
                  });
                  assert.strictEqual(service.getEndpoint().contract, contract);
                  assert.strictEqual(service.getEndpoint().address, address);
                  assert.strictEqual(service.getResource(), contract);
                  assert.strictEqual(service.getService(), address);
               });
               it('should use "service" option with "resource" option as "endpoint.address"', function () {
                  var contract = 'Users',
                     address = '/users/',
                     service = new SbisService({
                        resource: contract,
                        service: address
                     });
                  assert.strictEqual(service.getEndpoint().contract, contract);
                  assert.strictEqual(service.getEndpoint().address, address);
                  assert.strictEqual(service.getResource(), contract);
                  assert.strictEqual(service.getService(), address);
               });
               it('should use string "resource" option as "endpoint.contract"', function () {
                  var contract = 'Users',
                     service = new SbisService({
                        resource: contract
                     });
                  assert.strictEqual(service.getEndpoint().contract, contract);
                  assert.isUndefined(service.getEndpoint().address);
                  assert.strictEqual(service.getResource(), contract);
                  assert.strictEqual(service.getService(), '');
               });
               it('should use object "resource" option as "endpoint.contract" and "endpoint.address"', function () {
                  var contract = 'Users',
                     address = '/users/',
                     service = new SbisService({
                        resource: {
                           name: contract,
                           serviceUrl: address
                        }
                     });
                  assert.strictEqual(service.getEndpoint().contract, contract);
                  assert.strictEqual(service.getEndpoint().address, address);
                  assert.strictEqual(service.getResource(), contract);
                  assert.strictEqual(service.getService(), address);
               });
            });
         });

         describe('.create()', function () {
            context('when the service is exists', function () {
               it('should return an empty model', function (done) {
                  service.create().addCallbacks(function (model) {
                     try {
                        assert.isTrue(model instanceof Model);
                        assert.isFalse(model.isStored());
                        assert.isTrue(model.getId() > 0);
                        assert.strictEqual(model.get('Фамилия'), '');
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a valid request', function (done) {
                  service.create().addCallbacks(function () {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args;

                        assert.isNull(args['ИмяМетода']);
                        assert.strictEqual(args['Фильтр'].d[0], true, 'Wrong value for argument Фильтр.ВызовИзБраузера');
                        assert.strictEqual(args['Фильтр'].s[0].n, 'ВызовИзБраузера', 'Wrong name for argument Фильтр.ВызовИзБраузера');
                        assert.strictEqual(args['Фильтр'].s[0].t, 'Логическое', 'Wrong type for argument Фильтр.ВызовИзБраузера');

                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a request with valid meta data from record', function (done) {
                  var model = getSampleModel();
                  service.create(model).addCallbacks(function () {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args;
                        testArgIsModel(args['Фильтр'], model);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a request with valid meta data from object', function (done) {
                  var meta = getSampleMeta();
                  service.create(meta).addCallbacks(function () {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args,
                           fields = Object.keys(meta);
                        assert.strictEqual(args['Фильтр'].s.length, fields.length);
                        for (var i = 0; i <args['Фильтр'].d.length; i++) {
                           assert.strictEqual(args['Фильтр'].d[i], meta[fields[i]]);
                           assert.strictEqual(args['Фильтр'].s[i].n, fields[i]);
                        }
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a request with custom method name in the filter', function (done) {
                  var service = new SbisService({
                     endpoint: 'Товар',
                     binding: {
                        format: 'ПрочитатьФормат'
                     }
                  });
                  service.create().addCallbacks(function () {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args;
                        assert.strictEqual(args['ИмяМетода'], 'ПрочитатьФормат');
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should build hierarhy', function (done) {
                  var filter = {'Раздел':1,'Раздел@':true,'Раздел$':true};
                  service.create(filter).addBoth(function (err) {
                     var s = SbisBusinessLogic.lastRequest.args.Фильтр.s;
                     assert.strictEqual(s.length, 3);
                     for(var i = 0; i < s.length; i++) {
                        if (s[i].n in filter) {
                           assert.strictEqual(s[i].s, 'Иерархия');
                        }
                     }
                     done();
                  });
               });

               it('should not build hierarrhy', function (done) {
                  var filter = {'Раздел':1,'Раздел@':true};
                  service.create(filter).addBoth(function (err) {
                     var s = SbisBusinessLogic.lastRequest.args.Фильтр.s;
                     assert.strictEqual(s.length, 2);
                     for(var i = 0; i < s.length; i++) {
                        if (s[i].n in filter) {
                           assert.notEqual(s[i].s, 'Иерархия');
                        }
                     }
                     done();
                  });
               });
            });

             context('when the service isn\'t exists', function () {
               it('should return an error', function (done) {
                  var service = new SbisService({
                     endpoint: 'Купец'
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
                     service.read(SbisBusinessLogic.existsId).addCallbacks(function (model) {
                        try {
                           assert.isTrue(model instanceof Model);
                           assert.isTrue(model.isStored());
                           assert.strictEqual(model.getId(), SbisBusinessLogic.existsId);
                           assert.strictEqual(model.get('Фамилия'), 'Иванов');
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
                        endpoint: 'Товар',
                        binding: {
                           format: 'Формат'
                        }
                     });
                     service.read(
                        SbisBusinessLogic.existsId
                     ).addCallbacks(function () {
                        try {
                           var args = SbisBusinessLogic.lastRequest.args;
                           assert.strictEqual(args['ИмяМетода'], 'Формат');
                           assert.strictEqual(args['ИдО'], SbisBusinessLogic.existsId);
                           done();
                        } catch (err) {
                           done(err);
                        }
                     }, function (err) {
                        done(err);
                     });
                  });

                  it('should generate a request with valid meta data from record', function (done) {
                     service.read(
                        SbisBusinessLogic.existsId,
                        getSampleModel()
                     ).addCallbacks(function () {
                           try {
                              var args = SbisBusinessLogic.lastRequest.args;
                              testArgIsModel(args['ДопПоля'], getSampleModel());
                              done();
                           } catch (err) {
                              done(err);
                           }
                        }, function (err) {
                           done(err);
                        });
                  });

                  it('should generate a request with valid meta data from object', function (done) {
                     service.read(
                        SbisBusinessLogic.existsId,
                        getSampleMeta()
                     ).addCallbacks(function () {
                           try {
                              var args = SbisBusinessLogic.lastRequest.args;
                              assert.deepEqual(args['ДопПоля'], getSampleMeta());
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
                     service.read(SbisBusinessLogic.notExistsId).addBoth(function (err) {
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
                     endpoint: 'Купец'
                  });
                  service.read(SbisBusinessLogic.existsId).addBoth(function (err) {
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
                     service.read(SbisBusinessLogic.existsId).addCallbacks(function (model) {
                        model.set('Фамилия', 'Петров');
                        service.update(model).addCallbacks(function (success) {
                           try {
                              assert.isTrue(success > 0);
                              assert.isFalse(model.isChanged());
                              assert.strictEqual(model.get('Фамилия'), 'Петров');
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

               context('and the model was not stored', function () {
                  var testModel = function (success, model, done) {
                     try {
                        assert.isTrue(success > 0);
                        assert.isTrue(model.isStored());
                        assert.isFalse(model.isChanged());
                        assert.isTrue(model.getId() > 0);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  };

                  it('should create the model by 1st way', function (done) {
                     var service = new SbisService({
                        endpoint: 'Товар',
                        idProperty: '@Ид'
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
                           endpoint: 'Товар',
                           idProperty: '@Ид'
                        }),
                        model = getSampleModel();

                     service.update(model).addCallbacks(function (success) {
                        testModel(success, model, done);
                     }, function (err) {
                        done(err);
                     });
                  });
               });

               it('should generate a valid request', function (done) {
                  var service = new SbisService({
                     endpoint: 'Товар',
                     binding: {
                        format: 'Формат'
                     }
                  });
                  service.read(SbisBusinessLogic.existsId).addCallbacks(function (model) {
                     service.update(model).addCallbacks(function () {
                        try {
                           var args = SbisBusinessLogic.lastRequest.args;
                           testArgIsModel(args['Запись'], model);
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

               it('should generate a request with valid meta data from record', function (done) {
                  var meta = new Model({
                     adapter: 'adapter.sbis'
                  });
                  meta.addField({name: 'Тест', type: 'integer'}, undefined, 7);
                  service.update(
                     getSampleModel(),
                     meta
                  ).addCallbacks(function () {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args;
                        testArgIsModel(args['ДопПоля'], meta);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a request with valid meta data from object', function (done) {
                  service.update(
                     getSampleModel(),
                     getSampleMeta()
                  ).addCallbacks(function () {
                        try {
                           var args = SbisBusinessLogic.lastRequest.args;
                           assert.deepEqual(args['ДопПоля'], getSampleMeta());
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
                  service.create().addCallbacks(function (model) {
                        var service = new SbisService({
                           endpoint: 'Купец'
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
                     service.destroy(SbisBusinessLogic.existsId).addCallbacks(function (success) {
                        try {
                           assert.strictEqual(success[0], SbisBusinessLogic.existsId);
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
                     service.destroy(SbisBusinessLogic.notExistsId).addBoth(function (err) {
                        if (err instanceof Error) {
                           done();
                        } else {
                           done(new Error('That\'s no Error'));
                        }
                     });
                  });
               });

               it('should delete a few records', function (done) {
                  service.destroy([0, SbisBusinessLogic.existsId, 1]).addCallbacks(function (success) {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args;
                        assert.equal(args['ИдО'][0], 0);
                        assert.equal(args['ИдО'][1], SbisBusinessLogic.existsId);
                        assert.equal(args['ИдО'][2], 1);
                        assert.equal(success[0], SbisBusinessLogic.existsId);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should delete records by a composite key', function (done) {
                  var anId = 987;
                  service.destroy([SbisBusinessLogic.existsId + ',Товар', anId + ',Продукт']).addCallbacks(function (success) {
                     try {
                        var cfg = SbisBusinessLogic.lastRequest.cfg;
                        assert.strictEqual(cfg.endpoint.contract, 'Продукт');
                        var args = SbisBusinessLogic.lastRequest.args;
                        assert.equal(args['ИдО'], anId);
                        assert.equal(success[0], SbisBusinessLogic.existsId);
                        assert.equal(success[1], anId);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should delete records by text key', function (done) {
                  var anId = 'uuid';
                  service.destroy([anId]).addCallbacks(function (success) {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args;
                        assert.strictEqual(args['ИдО'][0], anId);
                        assert.strictEqual(success[0], anId);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a valid request', function (done) {
                  service.destroy(
                     SbisBusinessLogic.existsId
                  ).addCallbacks(function () {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args;
                        assert.equal(args['ИдО'][0], SbisBusinessLogic.existsId);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a request with valid meta data from record', function (done) {
                  service.destroy(
                     SbisBusinessLogic.existsId,
                     getSampleModel()
                  ).addCallbacks(function () {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args;
                        testArgIsModel(args['ДопПоля'], getSampleModel());
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a request with valid meta data from object', function (done) {
                  service.destroy(
                     SbisBusinessLogic.existsId,
                     getSampleMeta()
                  ).addCallbacks(function () {
                        try {
                           var args = SbisBusinessLogic.lastRequest.args;
                           assert.deepEqual(args['ДопПоля'], getSampleMeta());
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
                     endpoint: 'Купец'
                  });
                  service.destroy(SbisBusinessLogic.existsId).addBoth(function (err) {
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
                  service.query(new Query()).addCallbacks(function (ds) {
                     try {
                        assert.isTrue(ds instanceof DataSet);
                        assert.strictEqual(ds.getAll().getCount(), 2);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should take idProperty for dataset  from raw data', function (done) {
                  service.query(new Query()).addCallbacks(function (ds) {
                     try {
                        assert.strictEqual(ds.getIdProperty(), '@Ид');
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should work with no query', function (done) {
                  service.query().addCallbacks(function (ds) {
                     try {
                        assert.isTrue(ds instanceof DataSet);
                        assert.strictEqual(ds.getAll().getCount(), 2);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should return a list instance of injected module', function (done) {
                  var MyList = List.extend({});
                  service.setListModule(MyList);
                  service.query().addCallbacks(function (ds) {
                     try {
                        assert.isTrue(ds.getAll() instanceof MyList);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should return a model instance of injected module', function (done) {
                  var MyModel = Model.extend({});
                  service.setModel(MyModel);
                  service.query().addCallbacks(function (ds) {
                     try {
                        assert.isTrue(ds.getAll().at(0) instanceof MyModel);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a valid request', function (done) {
                  var recData = {
                        d: [1],
                        s: [{n: 'Число целое'}]
                     },
                     rsData = {
                        d: [[1], [2]],
                        s: [{n: 'Число целое'}]
                     },
                     query = new Query();
                  query
                     .select(['fieldOne', 'fieldTwo'])
                     .from('Goods')
                     .where({
                        id: 5,
                        enabled: true,
                        title: 'abc*',
                        path: [1, 2, 3],
                        obj: {a: 1, b: 2},
                        rec: new Model({
                           adapter: 'adapter.sbis',
                           rawData: recData
                        }),
                        rs: new RecordSet({
                           adapter: 'adapter.sbis',
                           rawData: rsData
                        })
                     })
                     .orderBy({
                        id: true,
                        enabled: false
                     })
                     .offset(100)
                     .limit(33);

                  service.query(query).addCallbacks(function () {
                        try {
                           var args = SbisBusinessLogic.lastRequest.args;

                           assert.strictEqual(args['Фильтр'].d[0], 5);
                           assert.strictEqual(args['Фильтр'].s[0].n, 'id');
                           assert.strictEqual(args['Фильтр'].s[0].t, 'Число целое');

                           assert.isTrue(args['Фильтр'].d[1]);
                           assert.strictEqual(args['Фильтр'].s[1].n, 'enabled');
                           assert.strictEqual(args['Фильтр'].s[1].t, 'Логическое');

                           assert.strictEqual(args['Фильтр'].d[2], 'abc*');
                           assert.strictEqual(args['Фильтр'].s[2].n, 'title');
                           assert.strictEqual(args['Фильтр'].s[2].t, 'Строка');

                           assert.deepEqual(args['Фильтр'].d[3], [1, 2, 3]);
                           assert.strictEqual(args['Фильтр'].s[3].n, 'path');
                           assert.strictEqual(args['Фильтр'].s[3].t.n, 'Массив');
                           assert.strictEqual(args['Фильтр'].s[3].t.t, 'Число целое');

                           assert.deepEqual(args['Фильтр'].d[4], {a: 1, b: 2});
                           assert.strictEqual(args['Фильтр'].s[4].n, 'obj');
                           assert.strictEqual(args['Фильтр'].s[4].t, 'JSON-объект');

                           assert.deepEqual(args['Фильтр'].d[5].d, recData.d);
                           assert.deepEqual(args['Фильтр'].d[5].s, recData.s);
                           assert.strictEqual(args['Фильтр'].s[5].n, 'rec');
                           assert.strictEqual(args['Фильтр'].s[5].t, 'Запись');

                           assert.deepEqual(args['Фильтр'].d[6].d, rsData.d);
                           assert.deepEqual(args['Фильтр'].d[6].s, rsData.s);
                           assert.strictEqual(args['Фильтр'].s[6].n, 'rs');
                           assert.strictEqual(args['Фильтр'].s[6].t, 'Выборка');

                           assert.strictEqual(args['Сортировка'].d[0][0], 'id');
                           assert.isTrue(args['Сортировка'].d[0][1]);
                           assert.isFalse(args['Сортировка'].d[0][2]);

                           assert.strictEqual(args['Сортировка'].d[1][0], 'enabled');
                           assert.isFalse(args['Сортировка'].d[1][1]);
                           assert.isTrue(args['Сортировка'].d[1][2]);

                           assert.strictEqual(args['Сортировка'].s[0].n, 'n');
                           assert.strictEqual(args['Сортировка'].s[1].n, 'o');
                           assert.strictEqual(args['Сортировка'].s[2].n, 'l');

                           assert.strictEqual(args['Навигация'].d[0], 3);
                           assert.strictEqual(args['Навигация'].s[0].n, 'Страница');

                           assert.strictEqual(args['Навигация'].d[1], 33);
                           assert.strictEqual(args['Навигация'].s[1].n, 'РазмерСтраницы');

                           assert.isTrue(args['Навигация'].d[2]);
                           assert.strictEqual(args['Навигация'].s[2].n, 'ЕстьЕще');

                           assert.strictEqual(args['ДопПоля'].length, 0);

                           done();
                        } catch (err) {
                           done(err);
                        }
                     }, function (err) {
                        done(err);
                     });
               });

               it('should generate a request with valid meta data from record', function (done) {
                  var query = new Query(),
                     meta = getSampleModel();
                  query.meta(meta);

                  service.query(query).addCallbacks(function () {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args,
                           i = 0;
                        meta.each(function(name, value) {
                           assert.strictEqual(args['ДопПоля'][i], value);
                           i++;
                        });
                        assert.strictEqual(args['ДопПоля'].length, i);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should generate a request with "hasMore" from given meta property', function (done) {
                  var hasMore = 'test',
                     query = new Query();
                  query
                     .offset(0)
                     .limit(10)
                     .meta({
                        hasMore: hasMore
                     });
                  service.query(query).addCallbacks(function () {
                     try {
                        var args = SbisBusinessLogic.lastRequest.args;

                        assert.strictEqual(args['Навигация'].d[2], hasMore);
                        assert.strictEqual(args['Навигация'].s[2].n, 'ЕстьЕще');

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
                     endpoint: 'Купец'
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

         describe('.call()', function () {
            context('when the method is exists', function () {
               it('should accept an object', function (done) {
                  var rs = new RecordSet({
                        rawData: [
                           {f1: 1, f2: 2},
                           {f1: 3, f2: 4}
                        ]
                     }),
                     sent = {
                        bool: false,
                        intgr: 1,
                        real: 1.01,
                        string: 'test',
                        obj: {a: 1, b: 2, c: 3},
                        rec: getSampleModel(),
                        rs: rs
                     };

                  service.call('Произвольный', sent).addCallbacks(function () {
                     try {
                        assert.strictEqual(SbisBusinessLogic.lastRequest.method, 'Произвольный');
                        var args = SbisBusinessLogic.lastRequest.args;

                        assert.deepEqual(args.rec, getSampleModel().getRawData());
                        delete sent.rec;
                        delete args.rec;

                        assert.deepEqual(args.rs, rs.getRawData());
                        delete sent.rs;
                        delete args.rs;

                        assert.deepEqual(args, sent);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should accept a model', function (done) {
                  var model = getSampleModel();

                  service.call('Произвольный', model).addCallbacks(function () {
                     try {
                        assert.strictEqual(SbisBusinessLogic.lastRequest.method, 'Произвольный');
                        var args = SbisBusinessLogic.lastRequest.args;
                        testArgIsModel(args, model);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should accept a dataset', function (done) {
                  var dataSet = new DataSet({
                     adapter: 'adapter.sbis',
                     rawData: {
                        _type: 'recordset',
                        d: [
                           [1, true],
                           [2, false],
                           [5, true]
                        ],
                        s: [
                           {'n': '@Ид', 't': 'Идентификатор'},
                           {'n': 'Флаг', 't': 'Логическое'}
                        ]
                     }
                  });

                  service.call('Произвольный', dataSet).addCallbacks(function () {
                     try {
                        assert.strictEqual(SbisBusinessLogic.lastRequest.method, 'Произвольный');
                        var args = SbisBusinessLogic.lastRequest.args;
                        testArgIsDataSet(args, dataSet);
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });
            });

            context('when the method isn\'t exists', function () {
               it('should return an error', function (done) {
                  service.call('МойМетод').addBoth(function (err) {
                     if (err instanceof Error) {
                        done();
                     } else {
                        done(new Error('That\'s no Error'));
                     }
                  });
               });
            });
         });

         describe('.prepareQueryParams()', function () {
            it('should return valid arguments', function () {
               var args = service.prepareQueryParams({
                     id: 5,
                     enabled: true,
                     title: 'abc*',
                     path: [1, 2, 3]
                  },
                  {
                     id: true,
                     enabled: false
                  },
                  100,
                  33
               );

               assert.strictEqual(args['Фильтр'].d[0], 5);
               assert.strictEqual(args['Фильтр'].s[0].n, 'id');
               assert.strictEqual(args['Фильтр'].s[0].t, 'Число целое');

               assert.isTrue(args['Фильтр'].d[1]);
               assert.strictEqual(args['Фильтр'].s[1].n, 'enabled');
               assert.strictEqual(args['Фильтр'].s[1].t, 'Логическое');

               assert.strictEqual(args['Фильтр'].d[2], 'abc*');
               assert.strictEqual(args['Фильтр'].s[2].n, 'title');
               assert.strictEqual(args['Фильтр'].s[2].t, 'Строка');

               assert.deepEqual(args['Фильтр'].d[3], [1, 2, 3]);
               assert.strictEqual(args['Фильтр'].s[3].n, 'path');
               assert.strictEqual(args['Фильтр'].s[3].t.n, 'Массив');
               assert.strictEqual(args['Фильтр'].s[3].t.t, 'Число целое');

               assert.strictEqual(args['Сортировка'].d[0][0], 'id');
               assert.isTrue(args['Сортировка'].d[0][1]);
               assert.isFalse(args['Сортировка'].d[0][2]);

               assert.strictEqual(args['Сортировка'].d[1][0], 'enabled');
               assert.isFalse(args['Сортировка'].d[1][1]);
               assert.isTrue(args['Сортировка'].d[1][2]);

               assert.strictEqual(args['Сортировка'].s[0].n, 'n');
               assert.strictEqual(args['Сортировка'].s[1].n, 'o');
               assert.strictEqual(args['Сортировка'].s[2].n, 'l');

               assert.strictEqual(args['Навигация'].d[0], 3);
               assert.strictEqual(args['Навигация'].s[0].n, 'Страница');

               assert.strictEqual(args['Навигация'].d[1], 33);
               assert.strictEqual(args['Навигация'].s[1].n, 'РазмерСтраницы');

               assert.isTrue(args['Навигация'].d[2]);
               assert.strictEqual(args['Навигация'].s[2].n, 'ЕстьЕще');

               assert.strictEqual(args['ДопПоля'].length, 0);
            });
         });
      });
   }
);
