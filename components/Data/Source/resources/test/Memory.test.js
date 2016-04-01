/* global beforeEach, afterEach, describe, context, it */
define([
      'js!SBIS3.CONTROLS.Data.Source.Memory',
      'js!SBIS3.CONTROLS.Data.Source.DataSet',
      'js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Collection.List',
      'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
      'js!SBIS3.CONTROLS.Data.Query.Query'
   ], function (MemorySource, DataSet, Model, List, RecordSet, Query) {
      'use strict';

      describe('SBIS3.CONTROLS.Data.Source.Memory', function () {
         var existsId = 5,
            existsPosition = 5,
            existsId2 = 6,
            existsPosition2 = 0,
            notExistsId = 33,
            data,
            source;

         beforeEach(function () {
            data = [{
               'Ид': 6,
               'ПорНом': 3,
               'Раздел': [null],
               'Фамилия': 'Иванов',
               'Имя': 'Иван',
               'Отчество': 'Иванович',
               'Должность': 'Инженер'
            }, {
               'Ид': 4,
               'ПорНом': 1,
               'Раздел': [null],
               'Фамилия': 'Петров',
               'Имя': 'Федор',
               'Отчество': 'Иванович',
               'Должность': 'Директор'
            }, {
               'ПорНом': null
            }, {
               'Ид': 7,
               'ПорНом': 6,
               'Раздел': [6],
               'Фамилия': 'Аксенова',
               'Имя': 'Федора',
               'Отчество': 'Сергеевна',
               'Должность': 'Инженер'
            }, {
               'Ид': 2,
               'ПорНом': 0,
               'Раздел': [4],
               'Фамилия': 'Афанасьев',
               'Имя': 'Иван',
               'Отчество': 'Андреевич',
               'Должность': 'Директор'
            }, {
               'Ид': null
            }, {
               'Ид': 5,
               'ПорНом': 4,
               'Раздел': [null],
               'Фамилия': 'Баранов',
               'Имя': 'Иванко',
               'Отчество': 'Петрович',
               'Должность': 'Карапуз'
            }, {
               'Ид': 1,
               'ПорНом': 5,
               'Раздел': [null],
               'Фамилия': 'Годолцов',
               'Имя': 'Иван',
               'Отчество': 'Викторович',
               'Должность': 'Директор'
            }, {
               'Ид': 3,
               'ПорНом': 3,
               'Раздел': [6],
               'Фамилия': 'Иванов',
               'Имя': 'Ян',
               'Отчество': 'Яковлевич',
               'Должность': 'Маркетолог'
            }];

            source = new MemorySource({
               data: data,
               idProperty: 'Ид'
            });
         });

         afterEach(function () {
            data = undefined;
            source = undefined;
         });

         describe('.create()', function () {
            it('should return an empty model', function (done) {
               source.create().addCallbacks(function (model) {
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
                     if (model.get('Фамилия') !== undefined) {
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

            it('should return an model with initial data', function (done) {
               source.create({
                  a: 1,
                  b: true
               }).addCallbacks(function (model) {
                  try {
                     if (model.get('a') !== 1) {
                        throw new Error('The model property "a" contains wrong data');
                     }
                     if (model.get('b') !== true) {
                        throw new Error('The model property "b" contains wrong data');
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

         describe('.read()', function () {
            context('when the model is exists', function () {
               it('should return the valid model', function (done) {
                  source.read(existsId).addCallbacks(function (model) {
                     try {
                        if (!(model instanceof Model)) {
                           throw new Error('That\'s no Model');
                        }
                        if (!model.isStored()) {
                           throw new Error('The model should be stored');
                        }
                        if (!model.getId()) {
                           throw new Error('The model has empty key');
                        }
                        if (model.getId() !== existsId) {
                           throw new Error('The model has wrong key');
                        }
                        if (model.get('Фамилия') !== 'Баранов') {
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
            });

            context('when the model isn\'t exists', function () {
               it('should return an error', function (done) {
                  source.read(notExistsId).addBoth(function (err) {
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
            context('when the model was stored', function () {
               it('should update the model', function (done) {
                  source.read(existsId).addCallbacks(function (model) {
                     model.set('Фамилия', 'Петров');
                     source.update(model).addCallbacks(function (success) {
                        try {
                           if (!success) {
                              throw new Error('Unsuccessful update');
                           }
                           if (model.isChanged()) {
                              throw new Error('The model should become unchanged');
                           }
                           source.read(existsId).addCallbacks(function (model) {
                              if (model.get('Фамилия') !== 'Петров') {
                                 done(new Error('Still have an old data'));
                              } else {
                                 done();
                              }
                           }, function (err) {
                              done(err);
                           });
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

            context('when the model was not stored', function () {
               var testModel = function (success, model, length, done) {
                  try {
                     if (!success) {
                        throw new Error('Unsuccessful update');
                     }
                     if (!model.isStored()) {
                        throw new Error('The model should become stored');
                     }
                     if (model.isChanged()) {
                        throw new Error('The model should become unchanged');
                     }
                     if (!model.getId()) {
                        throw new Error('The model should become having a key');
                     }
                     if (length !== data.length) {
                        throw new Error('The size of raw data expect to be ' + length + ' but ' + data.length + ' detected');
                     }
                     source.read(model.getId()).addCallbacks(function (modelToo) {
                        if (model.get('Фамилия') !== modelToo.get('Фамилия')) {
                           done(new Error('The source still have an old data'));
                        } else {
                           done();
                        }
                     }, function (err) {
                        done(err);
                     });
                  } catch (err) {
                     done(err);
                  }
               };

               it('should create the model by 1st way', function (done) {
                  var oldLength = data.length;
                  source.create().addCallbacks(function (model) {
                     model.set('Фамилия', 'Козлов');
                     source.update(model).addCallbacks(function (success) {
                        testModel(success, model, 1 + oldLength, done);
                     }, function (err) {
                        done(err);
                     });
                  }, function (err) {
                     done(err);
                  });
               });

               it('should create the model by 2nd way', function (done) {
                  var oldLength = data.length,
                     model = new Model({
                        idProperty: 'Ид'
                     });

                  model.set('Фамилия', 'Овечкин');
                  source.update(model).addCallbacks(function (success) {
                     testModel(success, model, 1 + oldLength, done);
                  }, function (err) {
                     done(err);
                  });
               });
            });
         });

         describe('.destroy()', function () {
            context('when the model is exists', function () {
               it('should return success', function (done) {
                  source.destroy(existsId).addCallbacks(function (success) {
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

               it('should really delete the model', function (done) {
                  source.destroy(existsId).addCallbacks(function () {
                     source.read(existsId).addCallbacks(function () {
                        done(new Error('The model still exists'));
                     }, function () {
                        //ok if err == Model is not found
                        done();
                     });
                  }, function (err) {
                     done(err);
                  });
               });

               it('should decrease the size of raw data', function (done) {
                  var targetLength = data.length - 1;
                  source.destroy(existsId).addCallbacks(function () {
                     try {
                        if (targetLength !== data.length) {
                           throw new Error('The size of raw data expect to be ' + targetLength + ' but ' + data.length + ' detected');
                        }
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should decrease the size of raw data when delete a few models', function (done) {
                  var targetLength = data.length - 2;
                  source.destroy([existsId,existsId2]).addCallbacks(function () {
                     try {
                        if (targetLength !== data.length) {
                           throw new Error('The size of raw data expect to be ' + targetLength + ' but ' + data.length + ' detected');
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

            context('when the model isn\'t exists', function () {
               it('should return an error', function (done) {
                  source.destroy(notExistsId).addBoth(function (err) {
                     if (err instanceof Error) {
                        done();
                     } else {
                        done(new Error('That\'s no Error'));
                     }
                  });
               });
            });
         });

         describe('.merge()', function () {
            context('when the model isn\'t exists', function () {
               it('should return an error', function (done) {
                  source.merge(notExistsId, existsId).addBoth(function (err) {
                     if (err instanceof Error) {
                        done();
                     } else {
                        done(new Error('That\'s no Error'));
                     }
                  });
               });

               it('should return an error', function (done) {
                  source.merge(existsId, notExistsId).addBoth(function (err) {
                     if (err instanceof Error) {
                        done();
                     } else {
                        done(new Error('That\'s no Error'));
                     }
                  });
               });
            });

            it('should merge models', function (done) {
               source.merge(existsId, existsId2).addCallbacks(function () {
                  source.read(existsId).addCallbacks(function () {
                     source.read(existsId2).addCallbacks(function(){
                        done(new Error('Exists extention model.'));
                     },function(){
                        done();
                     });
                  }, function (err) {
                     done(err);
                  });
               }, function(err){
                  done(err);
               });
            });
         });

         describe('.copy()', function () {
            it('should copy model', function (done) {
               var oldLength = data.length;
               source.copy(existsId).addCallbacks(function () {
                  if(data.length === 1 + oldLength) {
                     done();
                  } else {
                     done(new Error('Model dosn\'t copied'));
                  }
               }, function(err){
                  done(err);
               });
            });
         });

         describe('.query()', function () {
            it('should return a valid dataset', function (done) {
               source.query(new Query()).addCallbacks(function (ds) {
                  try {
                     if (!(ds instanceof DataSet)) {
                        throw new Error('That\'s no dataset');
                     }
                     if (ds.getAll().getCount() !== data.length) {
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
               source.query().addCallbacks(function (ds) {
                  try {
                     if (!(ds instanceof DataSet)) {
                        throw new Error('That\'s no dataset');
                     }
                     if (ds.getAll().getCount() !== data.length) {
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

            it('should return a list instance of injected module', function (done) {
               var MyList = List.extend({});
               source.setListModule(MyList);
               source.query().addCallbacks(function (ds) {
                  try {
                     if (!(ds.getAll() instanceof MyList)) {
                        throw new Error('Wrong list instance');
                     }
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
               source.setModel(MyModel);
               source.query().addCallbacks(function (ds) {
                  try {
                     if (!(ds.getAll().at(0) instanceof MyModel)) {
                        throw new Error('Wrong model instance');
                     }
                     done();
                  } catch (err) {
                     done(err);
                  }
               }, function (err) {
                  done(err);
               });
            });

            context('when the filter applied', function () {
               var tests = [{
                  filter: {'Фамилия': 'Иванов'},
                  expect: 2
               }, {
                  filter: {'Фамилия': 'Иванов'},
                  offset: 0,
                  expect: 2
               }, {
                  filter: {'Фамилия': 'Иванов'},
                  offset: 0,
                  limit: 0,
                  expect: 0
               }, {
                  filter: {'Фамилия': 'Иванов'},
                  offset: 0,
                  limit: 1,
                  expect: 1
               }, {
                  filter: {'Фамилия': 'Иванов'},
                  offset: 0,
                  limit: 2,
                  expect: 2
               }, {
                  filter: {'Фамилия': 'Иванов'},
                  offset: 1,
                  expect: 1
               }, {
                  filter: {'Фамилия': 'Иванов'},
                  offset: 1,
                  limit: 0,
                  expect: 0
               }, {
                  filter: {'Фамилия': 'Иванов'},
                  offset: 1,
                  limit: 1,
                  expect: 1
               }, {
                  filter: {'Фамилия': 'Иванов'},
                  offset: 2,
                  expect: 0
               }, {
                  filter: {'Фамилия': 'Иванов'},
                  offset: 2,
                  limit: 1,
                  expect: 0
               }, {
                  filter: {'Имя': 'Иван'},
                  expect: 3
               }, {
                  filter: {'Имя': 'Иван'},
                  offset: 0,
                  expect: 3
               }, {
                  filter: {'Имя': 'Иван'},
                  limit: 2,
                  expect: 2
               }, {
                  filter: {'Имя': 'Иван'},
                  offset: 0,
                  limit: 1,
                  expect: 1
               }, {
                  filter: {'Имя': 'Иван'},
                  offset: 0,
                  limit: 2,
                  expect: 2
               }, {
                  filter: {'Имя': 'Иван'},
                  offset: 1,
                  limit: 2,
                  expect: 2
               }, {
                  filter: {'Имя': 'Иван'},
                  offset: 2,
                  expect: 1
               }, {
                  filter: {'Имя': 'Иван'},
                  offset: 2,
                  limit: 2,
                  expect: 1
               }, {
                  filter: {'Отчество': 'Оглы'},
                  expect: 0
               }, {
                  filter: {'Раздел': null},
                  expect: 6
               }, {
                  filter: {'Раздел': 6},
                  expect: 2
               }, {
                  filter: {'Раздел': 99},
                  expect: 0
               }];
               for (var i = 0; i < tests.length; i++) {
                  (function (test, num) {
                     it('#' + num + ' should return ' + test.expect + ' model(s)', function (done) {
                        var query = new Query()
                           .where(test.filter)
                           .offset(test.offset)
                           .limit(test.limit);
                        source.query(query).addCallbacks(function (ds) {
                           if (ds.getAll().getCount() === test.expect) {
                              done();
                           } else {
                              done(new Error(ds.getAll().getCount() + ' expect to be ' + test.expect));
                           }
                        }, function (err) {
                           done(err);
                        });
                     });
                  })(tests[i], 1 + i);
               }
            });

            context('when sorting applied', function () {
               var tests = [{
                  sorting: 'Ид',
                  check: 'Ид',
                  expect: [undefined, null, 1, 2, 3, 4, 5, 6, 7]
               }, {
                  sorting: [{'Ид': false}],
                  check: 'Ид',
                  expect: [7, 6, 5, 4, 3, 2, 1, undefined, null]
               }, {
                  sorting: [{'Ид': true}],
                  offset: 2,
                  check: 'Ид',
                  expect: [1, 2, 3, 4, 5, 6, 7]
               }, {
                  sorting: [{'Ид': false}],
                  offset: 2,
                  check: 'Ид',
                  expect: [5, 4, 3, 2, 1, undefined, null]
               }, {
                  sorting: [{'Ид': true}],
                  limit: 4,
                  check: 'Ид',
                  expect: [undefined, null, 1, 2, 3, 4]
               }, {
                  sorting: [{'Ид': false}],
                  limit: 4,
                  check: 'Ид',
                  expect: [7, 6, 5, 4]
               }, {
                  sorting: [{'Ид': true}],
                  offset: 3,
                  limit: 2,
                  check: 'Ид',
                  expect: [2, 3, 4]
               }, {
                  sorting: [{'Ид': false}],
                  offset: 3,
                  limit: 2,
                  check: 'Ид',
                  expect: [4, 3]
               }, {
                  sorting: [{'Фамилия': true}],
                  limit: 5,
                  check: 'Фамилия',
                  expect: [undefined, undefined, 'Аксенова', 'Афанасьев', 'Баранов']
               }, {
                  sorting: [{'Фамилия': false}],
                  limit: 3,
                  check: 'Фамилия',
                  expect: ['Петров', 'Иванов', 'Иванов']
               }, {
                  sorting: [{'Имя': false}],
                  limit: 4,
                  check: 'Имя',
                  expect: ['Ян', 'Федора', 'Федор', 'Иванко']
               }, {
                  sorting: [{'Фамилия': true}, {'Имя': false}],
                  check: ['Фамилия', 'Имя'],
                  expect: ['+', '+', 'Аксенова+Федора', 'Афанасьев+Иван', 'Баранов+Иванко', 'Годолцов+Иван', 'Иванов+Ян', 'Иванов+Иван', 'Петров+Федор']
               }, {
                  sorting: [{'Имя': true}, {'Отчество': true}],
                  limit: 7,
                  check: ['Имя', 'Отчество'],
                  expect: ['+', '+', 'Иван+Андреевич', 'Иван+Викторович', 'Иван+Иванович', 'Иванко+Петрович', 'Федор+Иванович']
               }, {
                  sorting: [{'Имя': true}, {'Отчество': false}],
                  limit: 7,
                  check: ['Имя', 'Отчество'],
                  expect: ['+', '+', 'Иван+Иванович', 'Иван+Викторович', 'Иван+Андреевич', 'Иванко+Петрович', 'Федор+Иванович']
               }, {
                  sorting: [{'Должность': true}, {'Фамилия': true}, {'Имя': true}],
                  check: ['Должность', 'Фамилия', 'Имя'],
                  expect: ['++', '++', 'Директор+Афанасьев+Иван', 'Директор+Годолцов+Иван', 'Директор+Петров+Федор', 'Инженер+Аксенова+Федора', 'Инженер+Иванов+Иван', 'Карапуз+Баранов+Иванко', 'Маркетолог+Иванов+Ян']
               }];

               for (var i = 0; i < tests.length; i++) {
                  (function (test, num) {
                     if (!(test.check instanceof Array)) {
                        test.check = [test.check];
                     }

                     it('#' + num + ' should return ' + test.expect + ' models order', function (done) {
                        var query = new Query()
                           .where(test.filter)
                           .orderBy(test.sorting)
                           .offset(test.offset)
                           .limit(test.limit);
                        source.query(query).addCallbacks(function (ds) {
                           var modelNum = 0,
                              failOn;
                           ds.getAll().each(function (model) {
                              if (failOn === undefined) {
                                 var have,
                                    need = test.expect[modelNum];
                                 if (test.check.length > 1) {
                                    have = [];
                                    for (var j = 0; j < test.check.length; j++) {
                                       have.push(model.get(test.check[j]));
                                    }
                                    have = have.join('+');
                                 } else {
                                    have = model.get(test.check[0]);
                                 }
                                 if (have !== need) {
                                    failOn = [have, need];
                                 }
                              }
                              modelNum++;
                           });
                           if (failOn) {
                              done(new Error('The model with value "' + failOn[0] + '" has been found. Expect to be "' + failOn[1] + '".'));
                           } else {
                              done();
                           }
                        }, function (err) {
                           done(err);
                        });
                     });
                  })(tests[i], 1 + i);
               }
            });
         });

         describe('.move()', function () {
            it('should move ' + existsId + ' instead ' + existsId2, function (done) {
               source.read(existsId).addCallback(function (model1) {
                  source.read(existsId2).addCallback(function (model2) {
                     source.call('move', {
                        from: model1,
                        to: model2,
                        details: {after: false}
                     }).addCallbacks(function() {
                        if (data[existsPosition2]['Ид'] === existsId && data[existsPosition2 + 1]['Ид'] === existsId2) {
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

            it('should move ' + existsId2 + ' instead ' + existsId, function (done) {
               source.read(existsId2).addCallback(function (model1) {
                  source.read(existsId).addCallback(function (model2) {
                     source.call('move', {
                        from: model1,
                        to: model2,
                        details: {after: false}
                     }).addCallbacks(function() {
                        if (data[existsPosition]['Ид'] === existsId && data[1 + existsPosition]['Ид'] === existsId2) {
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

            it('should move ' + existsId + ' after ' + existsId2, function (done) {
               source.read(existsId).addCallback(function (model1) {
                  source.read(existsId2).addCallback(function (model2) {
                     source.call('move', {
                        from: model1,
                        to: model2,
                        details: {after: true}
                     }).addCallbacks(function() {
                        if(data[existsPosition2]['Ид'] === existsId2 && data[1 + existsPosition2]['Ид'] === existsId) {
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

            it('should move ' + existsId2 + ' after ' + existsId, function (done) {
               source.read(existsId2).addCallback(function (model1) {
                  source.read(existsId).addCallback(function (model2) {
                     source.call('move', {
                        from: model1,
                        to: model2,
                        details: {after: true}
                     }).addCallbacks(function() {
                        if(data[existsPosition]['Ид'] === existsId && data[1 + existsPosition]['Ид'] === existsId2) {
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

            it('should move before record with ПорНом=6', function (done) {
               var pn = 6,
                  newPos = 3;
               source.read(existsId).addCallback(function (model) {
                  source.read(existsId2).addCallback(function (model2) {
                     source.call('move', {
                        from: model,
                        to: model2,
                        details: {column: 'ПорНом', after: false}
                     }).addCallbacks(function() {
                        if(data[newPos]['Ид'] === existsId && data[1 + newPos]['ПорНом'] === pn) {
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

            it('should move after record with ПорНом=6', function (done) {
               var pn = 6,
                  newPos = 4;
               source.read(existsId).addCallback(function (model) {
                  source.read(existsId2).addCallback(function (model2) {
                     source.call('move', {
                        from: model,
                        to: model2,
                        details: {column: 'ПорНом', after: true}
                     }).addCallbacks(function() {
                        if(data[newPos]['Ид'] === existsId && data[newPos - 1]['ПорНом'] === pn) {
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
         
         context('when use recordset as data', function () {
            beforeEach(function () {
               data = new RecordSet({
                  rawData: data
               });

               source = new MemorySource({
                  data: data,
                  adapter: 'adapter.recordset',
                  idProperty: 'Ид'
               });
            });
            
            describe('.create()', function () {
               it('should return an empty model', function (done) {
                  source.create().addCallbacks(function (model) {
                     try {
                        if (!(model instanceof Model)) {
                           throw new Error('That\'s no Model');
                        }
                        done();
                     } catch (err) {
                        done(err);
                     }
                  }, function (err) {
                     done(err);
                  });
               });

               it('should return an model with initial data', function (done) {
                  source.create(new Model({
                     rawData: {
                        a: 1,
                        b: true
                     }
                  })).addCallbacks(function (model) {
                     try {
                        if (model.get('a') !== 1) {
                           throw new Error('The model property "a" contains wrong data');
                        }
                        if (model.get('b') !== true) {
                           throw new Error('The model property "b" contains wrong data');
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
            
            describe('.read()', function () {
               context('when the model is exists', function () {
                  it('should return the valid model', function (done) {
                     source.read(existsId).addCallbacks(function (model) {
                        try {
                           if (!(model instanceof Model)) {
                              throw new Error('That\'s no Model');
                           }
                           if (model.getId() !== existsId) {
                              throw new Error('The model has wrong key');
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

               context('when the model isn\'t exists', function () {
                  it('should return an error', function (done) {
                     source.read(notExistsId).addBoth(function (err) {
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
               context('when the model was stored', function () {
                  it('should update the model', function (done) {
                     source.read(existsId).addCallbacks(function (model) {
                        model.set('Фамилия', 'Петров');
                        source.update(model).addCallbacks(function (success) {
                           try {
                              if (!success) {
                                 throw new Error('Unsuccessful update');
                              }
                              source.read(existsId).addCallbacks(function (model) {
                                 if (model.get('Фамилия') !== 'Петров') {
                                    done(new Error('Still have an old data'));
                                 } else {
                                    done();
                                 }
                              }, function (err) {
                                 done(err);
                              });
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

               context('when the model was not stored', function () {
                  var testModel = function (success, model, length, done) {
                     try {
                        if (!success) {
                           throw new Error('Unsuccessful update');
                        }
                        if (length !== data.getCount()) {
                           throw new Error('The size of raw data expect to be ' + length + ' but ' + data.length + ' detected');
                        }
                        source.read(model.getId()).addCallbacks(function (modelToo) {
                           if (model.get('Фамилия') !== modelToo.get('Фамилия')) {
                              done(new Error('The source still have an old data'));
                           } else {
                              done();
                           }
                        }, function (err) {
                           done(err);
                        });
                     } catch (err) {
                        done(err);
                     }
                  };

                  it('should create the model by 1st way', function (done) {
                     var oldLength = data.getCount();
                     source.create().addCallbacks(function (model) {
                        model.set('Фамилия', 'Козлов');
                        source.update(model).addCallbacks(function (success) {
                           testModel(success, model, 1 + oldLength, done);
                        }, function (err) {
                           done(err);
                        });
                     }, function (err) {
                        done(err);
                     });
                  });

                  it('should create the model by 2nd way', function (done) {
                     var oldLength = data.getCount(),
                        model = new Model({
                           idProperty: 'Ид',
                           adapter: 'adapter.recordset'
                        });
                     model.set('Фамилия', 'Овечкин');
                     source.update(model).addCallbacks(function (success) {
                        testModel(success, model, 1 + oldLength, done);
                     }, function (err) {
                        done(err);
                     });
                  });
               });
            });

            describe('.destroy()', function () {
               context('when the model is exists', function () {
                  it('should return success', function (done) {
                     source.destroy(existsId).addCallbacks(function (success) {
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

                  it('should really delete the model', function (done) {
                     source.destroy(existsId).addCallbacks(function () {
                        source.read(existsId).addCallbacks(function () {
                           done(new Error('The model still exists'));
                        }, function () {
                           done();
                        });
                     }, function (err) {
                        done(err);
                     });
                  });

                  it('should decrease the size of raw data', function (done) {
                     var targetLength = data.getCount() - 1;
                     source.destroy(existsId).addCallbacks(function () {
                        try {
                           if (targetLength !== data.getCount()) {
                              throw new Error('The size of raw data expect to be ' + targetLength + ' but ' + data.length + ' detected');
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

               context('when the model isn\'t exists', function () {
                  it('should return an error', function (done) {
                     source.destroy(notExistsId).addBoth(function (err) {
                        if (err instanceof Error) {
                           done();
                        } else {
                           done(new Error('That\'s no Error'));
                        }
                     });
                  });
               });
            });

            describe('.merge()', function () {
               context('when the model isn\'t exists', function () {
                  it('should return an error', function (done) {
                     source.merge(notExistsId, existsId).addBoth(function (err) {
                        if (err instanceof Error) {
                           done();
                        } else {
                           done(new Error('That\'s no Error'));
                        }
                     });
                  });

                  it('should return an error', function (done) {
                     source.merge(existsId, notExistsId).addBoth(function (err) {
                        if (err instanceof Error) {
                           done();
                        } else {
                           done(new Error('That\'s no Error'));
                        }
                     });
                  });
               });

               it('should merge models', function (done) {
                  source.merge(existsId, existsId2).addCallbacks(function () {
                     source.read(existsId).addCallbacks(function () {
                        source.read(existsId2).addCallbacks(function(){
                           done(new Error('Exists extention model.'));
                        },function(){
                           done();
                        });
                     }, function (err) {
                        done(err);
                     });
                  }, function(err){
                     done(err);
                  });
               });
            });

            describe('.copy()', function () {
               it('should copy model', function (done) {
                  var oldLength = data.getCount();
                  source.copy(existsId).addCallbacks(function () {
                     if(data.getCount() === 1 + oldLength) {
                        done();
                     } else {
                        done(new Error('Model dosn\'t copied'));
                     }
                  }, function(err){
                     done(err);
                  });
               });
            });

            describe('.query()', function () {
               it('should return a valid dataset', function (done) {
                  source.query(new Query()).addCallbacks(function (ds) {
                     try {
                        if (!(ds instanceof DataSet)) {
                           throw new Error('That\'s no dataset');
                        }
                        if (ds.getAll().getCount() !== data.getCount()) {
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
                  source.query().addCallbacks(function (ds) {
                     try {
                        if (!(ds instanceof DataSet)) {
                           throw new Error('That\'s no dataset');
                        }
                        if (ds.getAll().getCount() !== data.getCount()) {
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

               it('should return a list instance of injected module', function (done) {
                  var MyList = List.extend({});
                  source.setListModule(MyList);
                  source.query().addCallbacks(function (ds) {
                     try {
                        if (!(ds.getAll() instanceof MyList)) {
                           throw new Error('Wrong list instance');
                        }
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
                  source.setModel(MyModel);
                  source.query().addCallbacks(function (ds) {
                     try {
                        if (!(ds.getAll().at(0) instanceof MyModel)) {
                           throw new Error('Wrong model instance');
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
         });
      });
   }
);
