/* global describe, context, it, assert */
var existsId = 7,
    notExistsId = 99;

/* Mocking SbisServiceBLO */
define(
    'js!SBIS3.CONTROLS.SbisServiceSource/resources/SbisServiceBLO',
    [],
    function() {
        return $ws.core.extend({}, {
            _service: '',
            $constructor: function(service) {
                this._service = service;
            },
            call: function(method, args) {
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

                if (this._service !== 'Товар') {
                    error = 'Service is not found';
                }

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
                        if (args['ИдО'] == existsId) {
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
                            error = 'Record is not found';
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
                        if (args['ИдО'] == existsId) {
                            data = existsId;
                        } else {
                            error = 'Record is not found';
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

                    default:
                        throw new Error('Method is undefined');
                }

                setTimeout(function() {
                    if (error) {
                        return def.errback(error);
                    }

                    def.callback(data);
                }.bind(this), 10);

                return def;
            }
        });
    }
);

define([
   'js!SBIS3.CONTROLS.SbisServiceSource',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.SbisJSONStrategy',
   'js!SBIS3.CONTROLS.ArrayStrategy'
], function (SbisServiceSource, DataSet, Record, SbisJSONStrategy, ArrayStrategy) {
        describe('SBIS3.CONTROLS.SbisServiceSource', function() {
            describe('.create()', function() {
                context('when the service is exists', function() {
                    it('should return an empty record', function(done) {
                        var service = new SbisServiceSource({
                            service: 'Товар'
                        });
                        service.create().addCallbacks(function(record) {
                            try {
                                if (!(record instanceof Record)) {
                                    throw new Error('That\'s no Record');
                                }
                                if (record.isCreated()) {
                                    throw new Error('The record should be not created');
                                }
                                if (record.getKey()) {
                                    throw new Error('The record has not empty key');
                                }
                                if (record.get('Фамилия') !== '') {
                                    throw new Error('The record contains wrong data');
                                }
                                done();
                            } catch (err) {
                                done(err);
                            }
                        }, function(err) {
                            done(err);
                        });
                    });
                });

                context('when the service isn\'t exists', function() {
                    it('should return an error', function(done) {
                        var service = new SbisServiceSource({
                            service: 'Купец'
                        });
                        service.create().addBoth(function(err) {
                            if (err instanceof Error) {
                                done();
                            } else {
                                done(new Error('That\'s no Error'));
                            }
                        });
                    });
                });
            });

            describe('.read()', function() {
                context('when the service is exists', function() {
                    context('and the record is exists', function() {
                        it('should return valid record', function(done) {
                            var service = new SbisServiceSource({
                                service: 'Товар'
                            });
                            service.read(existsId).addCallbacks(function(record) {
                                try {
                                    if (!(record instanceof Record)) {
                                        throw new Error('That\'s no Record');
                                    }
                                    if (!record.isCreated()) {
                                        throw new Error('The record should be created');
                                    }
                                    if (!record.getKey()) {
                                        throw new Error('The record has empty key');
                                    }
                                    if (record.getKey() != existsId) {
                                        throw new Error('The record has wrong key');
                                    }
                                    if (record.get('Фамилия') !== 'Иванов') {
                                        throw new Error('The record contains wrong data');
                                    }
                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }, function(err) {
                                done(err);
                            });
                        });
                    });

                    context('and the record isn\'t exists', function() {
                        it('should return an error', function(done) {
                            var service = new SbisServiceSource({
                                service: 'Товар'
                            });
                            service.read(notExistsId).addBoth(function(err) {
                                if (err instanceof Error) {
                                    done();
                                } else {
                                    done(new Error('That\'s no Error'));
                                }
                            });
                        });
                    });
                });

                context('when the service isn\'t exists', function() {
                    it('should return an error', function(done) {
                        var service = new SbisServiceSource({
                            service: 'Купец'
                        });
                        service.read(existsId).addBoth(function(err) {
                            if (err instanceof Error) {
                                done();
                            } else {
                                done(new Error('That\'s no Error'));
                            }
                        });
                    });
                });
            });

            describe('.update()', function() {
                context('when the service is exists', function() {
                    context('and the record was created', function() {
                        it('should update the record', function(done) {
                            var service = new SbisServiceSource({
                                service: 'Товар'
                            });

                            service.read(existsId).addCallbacks(function(record) {
                                record.set('Фамилия', 'Петров');
                                service.update(record).addCallbacks(function(success) {
                                    try {
                                        if (!success) {
                                            throw new Error('Unsuccessful update');
                                        }
                                        if (record.isChanged()) {
                                            throw new Error('The record should become unchanged');
                                        }
                                        if (record.get('Фамилия') != 'Петров') {
                                            throw new Error('The record contains wrong data');
                                        }
                                        done();
                                    } catch (err) {
                                        done(err);
                                    }
                                }, function(err) {
                                    done(err);
                                });
                            }, function(err) {
                                done(err);
                            });
                        });
                    });

                    var testRecord = function(success, record, done) {
                        try {
                            if (!success) {
                                throw new Error('Unsuccessful update');
                            }
                            if (!record.isCreated()) {
                                throw new Error('The record should become created');
                            }
                            if (record.isChanged()) {
                                throw new Error('The record should become unchanged');
                            }
                            if (!record.getKey()) {
                                throw new Error('The record should become having a key');
                            }
                            done();
                        } catch (err) {
                            done(err);
                        }
                    };

                    context('and the record was not created', function() {
                        it('should create the record by 1st way', function(done) {
                            var service = new SbisServiceSource({
                                service: 'Товар'
                            });
                            service.create().addCallbacks(function(record) {
                                service.update(record).addCallbacks(function(success) {
                                    testRecord(success, record, done);
                                }, function(err) {
                                    done(err);
                                });
                            }, function(err) {
                                done(err);
                            });
                        });

                        it('should create the record by 2nd way', function(done) {
                            var service = new SbisServiceSource({
                                    service: 'Товар'
                                }),
                                record = new Record({
                                    strategy: new SbisJSONStrategy(),
                                    raw: {
                                        d: [
                                            0,
                                            ''
                                        ],
                                        s: [
                                            {'n': 'Ид', 't': 'Число целое'},
                                            {'n': 'Фамилия', 't': 'Строка'}
                                        ]
                                    },
                                    keyField: 'Ид'
                                });

                            service.update(record).addCallbacks(function(success) {
                                testRecord(success, record, done);
                            }, function(err) {
                                done(err);
                            });
                        });
                    });
                });

                context('when the service isn\'t exists', function() {
                    it('should return an error', function(done) {
                        new SbisServiceSource({
                            service: 'Товар'
                        }).create().addCallbacks(function(record) {
                                var service = new SbisServiceSource({
                                    service: 'Купец'
                                });
                                service.update(record).addBoth(function(err) {
                                    if (err instanceof Error) {
                                        done();
                                    } else {
                                        done(new Error('That\'s no Error'));
                                    }
                                });
                            }, function(err) {
                                done(err);
                            });
                    });
                });
            });

            describe('.destroy()', function() {
                context('when the service is exists', function() {
                    context('and the record is exists', function() {
                        it('should return success', function(done) {
                            var service = new SbisServiceSource({
                                service: 'Товар'
                            });
                            service.destroy(existsId).addCallbacks(function(success) {
                                try {
                                    if (!success) {
                                        throw new Error('Unsuccessful destroy');
                                    } else {
                                        done();
                                    }
                                } catch (err) {
                                    done(err);
                                }
                            }, function(err) {
                                done(err);
                            });
                        });
                    });

                    context('and the record isn\'t exists', function() {
                        it('should return an error', function(done) {
                            var service = new SbisServiceSource({
                                service: 'Товар'
                            });
                            service.destroy(notExistsId).addBoth(function(err) {
                                if (err instanceof Error) {
                                    done();
                                } else {
                                    done(new Error('That\'s no Error'));
                                }
                            });
                        });
                    });
                });

                context('when the service isn\'t exists', function() {
                    it('should return an error', function(done) {
                        var service = new SbisServiceSource({
                            service: 'Купец'
                        });
                        service.destroy(existsId).addBoth(function(err) {
                            if (err instanceof Error) {
                                done();
                            } else {
                                done(new Error('That\'s no Error'));
                            }
                        });
                    });
                });
            });

            describe('.sync()', function() {
                context('when the service is exists', function() {
                    it('should set the record to be added and unchanged', function(done) {
                        var service = new SbisServiceSource({
                            service: 'Товар'
                        });
                        service.create().addCallbacks(function(record) {
                            service.sync(record).addCallbacks(function() {
                                try {
                                    if (!record.isCreated()) {
                                        throw new Error('The record should become created');
                                    }
                                    if (record.isChanged()) {
                                        throw new Error('The record should become unchanged');
                                    }
                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }, function(err) {
                                done(err);
                            });
                        }, function(err) {
                            done(err);
                        });
                    });

                    it('should set the record to be unchanged', function(done) {
                        var service = new SbisServiceSource({
                            service: 'Товар'
                        });
                        service.read(existsId).addCallbacks(function(record) {
                            record.set('Фамилия', 'Петров');
                            service.sync(record).addCallbacks(function() {
                                try {
                                    if (record.isChanged()) {
                                        throw new Error('The record should become unchanged');
                                    } else {
                                        done();
                                    }
                                } catch (err) {
                                    done(err);
                                }
                            }, function(err) {
                                done(err);
                            });
                        }, function(err) {
                            done(err);
                        });
                    });

                    it('should throw an error if argument is invalid', function() {
                        var service = new SbisServiceSource({
                            service: 'Товар'
                        });
                        assert.throw(function() {
                            service.sync('blah-blah');
                        });
                        assert.throw(function() {
                            service.sync({blah: 'blah'});
                        });
                    });
                });

                context('when the service isn\'t exists', function() {
                    it('should return an error', function(done) {
                        var service = new SbisServiceSource({
                            service: 'Купец'
                        });
                        var record = new Record({
                            strategy: new ArrayStrategy()
                        });
                        service.sync(record).addBoth(function(err) {
                            if (err instanceof Error) {
                                done();
                            } else {
                                done(new Error('That\'s no Error'));
                            }
                        });
                    });
                });
            });

            describe('.query()', function() {
                context('when the service is exists', function() {
                    it('should return a valid dataset', function(done) {
                        var service = new SbisServiceSource({
                            service: 'Товар'
                        });
                        service.query(
                            {},
                            []
                        ).addCallbacks(function(ds) {
                                try {
                                    if (!(ds instanceof DataSet)) {
                                        throw new Error('That\'s no dataset');
                                    }
                                    if (ds.getCount() != 2) {
                                        throw new Error('Wrong records count');
                                    }
                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }, function(err) {
                                done(err);
                            });
                    });
                });

                context('when the service isn\'t exists', function() {
                    it('should return an error', function(done) {
                        var service = new SbisServiceSource({
                            service: 'Купец'
                        });
                        service.query(
                            {},
                            []
                        ).addBoth(function(err) {
                                if (err instanceof Error) {
                                    done();
                                } else {
                                    done(new Error('That\'s no Error'));
                                }
                            });
                    });
                });
            });
        });
    }
);
