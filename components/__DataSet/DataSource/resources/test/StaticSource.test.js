/* global beforeEach, afterEach, describe, context, it */
define(
    ['js!SBIS3.CONTROLS.StaticSource', 'js!SBIS3.CONTROLS.DataFactory', 'js!SBIS3.CONTROLS.DataSet', 'js!SBIS3.CONTROLS.Record', 'js!SBIS3.CONTROLS.ArrayStrategy'],
    function (StaticSource, DataFactory, DataSet, Record, ArrayStrategy) {
        var existsId = 5,
            notExistsId = 33,
            data,
            service;

        beforeEach(function() {
            data = [{
                'Ид': 6,
                'Фамилия': 'Иванов',
                'Имя': 'Иван',
                'Отчество': 'Иванович',
                'Должность': 'Инженер'
            }, {
                'Ид': 4,
                'Фамилия': 'Петров',
                'Имя': 'Федор',
                'Отчество': 'Иванович',
                'Должность': 'Директор'
            }, {
                'Ид': 7,
                'Фамилия': 'Аксенова',
                'Имя': 'Федора',
                'Отчество': 'Сергеевна',
                'Должность': 'Инженер'
            }, {
                'Ид': 2,
                'Фамилия': 'Афанасьев',
                'Имя': 'Иван',
                'Отчество': 'Андреевич',
                'Должность': 'Директор'
            }, {
                'Ид': 5,
                'Фамилия': 'Баранов',
                'Имя': 'Иванко',
                'Отчество': 'Петрович',
                'Должность': 'Карапуз'
            }, {
                'Ид': 1,
                'Фамилия': 'Годолцов',
                'Имя': 'Иван',
                'Отчество': 'Викторович',
                'Должность': 'Директор'
            }, {
                'Ид': 3,
                'Фамилия': 'Иванов',
                'Имя': 'Ян',
                'Отчество': 'Яковлевич',
                'Должность': 'Маркетолог'
            }];

            service = new StaticSource({
                data: data,
                keyField: 'Ид'
            });
        });

        afterEach(function() {
            data = undefined;
            service = undefined;
        });

        describe('SBIS3.CONTROLS.StaticSource', function() {
            describe('.create()', function() {
                it('should return an empty record', function(done) {
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
                            if (record.get('Фамилия') !== undefined) {
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

            describe('.read()', function() {
                context('when the record is exists', function() {
                    it('should return the valid record', function(done) {
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
                                if (record.get('Фамилия') !== 'Баранов') {
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

                context('when the record isn\'t exists', function() {
                    it('should return an error', function(done) {
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

            describe('.update()', function() {
                context('when the record was created', function() {
                    it('should update the record', function(done) {
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
                                    service.read(existsId).addCallbacks(function(record) {
                                        if (record.get('Фамилия') != 'Петров') {
                                            done(new Error('Still have an old data'));
                                        } else {
                                            done();
                                        }
                                    }, function(err) {
                                        done(err);
                                    });
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

                context('when the record was not created', function() {
                    var testRecord = function(success, record, length, done) {
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
                            if (length !== data.length) {
                                throw new Error('The size of raw data expect to be ' + length + ' but ' + data.length + ' detected');
                            }
                            service.read(record.getKey()).addCallbacks(function(recordToo) {
                                if (record.get('Фамилия') !== recordToo.get('Фамилия')) {
                                    done(new Error('The source still have an old data'));
                                } else {
                                    done();
                                }
                            }, function(err) {
                                done(err);
                            });
                        } catch (err) {
                            done(err);
                        }
                    };

                    it('should create the record by 1st way', function(done) {
                        var oldLength = data.length;
                        service.create().addCallbacks(function(record) {
                            record.set('Фамилия', 'Козлов');
                            service.update(record).addCallbacks(function(success) {
                                testRecord(success, record, 1 + oldLength, done);
                            }, function(err) {
                                done(err);
                            });
                        }, function(err) {
                            done(err);
                        });
                    });

                    it('should create the record by 2nd way', function(done) {
                        var oldLength = data.length,
                            record = new Record({
                                strategy: new ArrayStrategy(),
                                keyField: 'Ид'
                            });

                        record.set('Фамилия', 'Овечкин');
                        service.update(record).addCallbacks(function(success) {
                            testRecord(success, record, 1 + oldLength, done);
                        }, function(err) {
                            done(err);
                        });
                    });
                });
            });

            describe('.destroy()', function() {
                context('when the record is exists', function() {
                    it('should return success', function(done) {
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

                    it('should really delete the record', function(done) {
                        service.destroy(existsId).addCallbacks(function() {
                            service.read(existsId).addCallbacks(function() {
                                done(new Error('The record still exists'));
                            }, function() {
                                //ok if err == Record is not found
                                done();
                            });
                        }, function(err) {
                            done(err);
                        });
                    });

                    it('should decrease the size of raw data', function(done) {
                        var targetLength = data.length - 1;
                        service.destroy(existsId).addCallbacks(function() {
                            try {
                                if (targetLength !== data.length) {
                                    throw new Error('The size of raw data expect to be ' + targetLength + ' but ' + data.length + ' detected');
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

                context('when the record isn\'t exists', function() {
                    it('should return an error', function(done) {
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

            describe('.sync()', function() {
                context('when a record received', function() {
                    it('should set the new record to be added and unchanged', function(done) {
                        service.create().addCallbacks(function(record) {
                            service.sync(record).addCallbacks(function() {
                                try {
                                    if (!record.isCreated()) {
                                        throw new Error('The record should become created');
                                    }
                                    if (record.isChanged()) {
                                        throw new Error('The record should become unchanged');
                                    }
                                    if (!record.getKey()) {
                                        throw new Error('The record should become having a key');
                                    }
                                    service.read(record.getKey()).addCallbacks(function() {
                                        done();
                                    }, function(err) {
                                        done(err);
                                    });
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

                    it('should set the exists record to be unchanged', function(done) {
                        service.read(existsId).addCallbacks(function(record) {
                            record.set('Фамилия', 'Петров');
                            service.sync(record).addCallbacks(function() {
                                try {
                                    if (record.isChanged()) {
                                        throw new Error('The record should become unchanged');
                                    }
                                    service.read(existsId).addCallbacks(function(recordToo) {
                                        if (record.get('Фамилия') !== recordToo.get('Фамилия')) {
                                            done(new Error('The source still have an old data'));
                                        } else {
                                            done();
                                        }
                                    }, function(err) {
                                        done(err);
                                    });
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

                    it('should really delete the record', function(done) {
                        service.read(existsId).addCallbacks(function(record) {
                            record.setDeleted(true);
                            service.sync(record).addCallbacks(function() {
                                service.read(existsId).addCallbacks(function() {
                                    done(new Error('The record still exists'));
                                }, function() {
                                    //ok if err == Record is not found
                                    done();
                                });
                            }, function(err) {
                                done(err);
                            });
                        }, function(err) {
                            done(err);
                        });
                    });
                });

                context('when a dataset received', function() {
                    var dataSet;

                    beforeEach(function() {
                        dataSet = new DataSet({
                            strategy: new ArrayStrategy(),
                            data: data,
                            keyField: 'Ид'
                        });
                    });

                    afterEach(function() {
                        dataSet = undefined;
                    });

                    it('should change records states', function(done) {
                        var changedRecord = dataSet.getRecordByKey(1),
                            deletedRecord = dataSet.getRecordByKey(2),
                            newRecord = new Record({
                                strategy: new ArrayStrategy(),
                                keyField: 'Ид'
                            });

                        changedRecord.set('Фамилия', 'Дуремар');
                        deletedRecord.setDeleted(true);
                        dataSet.push(newRecord);

                        service.sync(dataSet).addCallbacks(function() {
                            try {
                                if (changedRecord.isChanged()) {
                                    throw new Error('The record should become unchanged');
                                }
                                if (!newRecord.isCreated()) {
                                    throw new Error('The record should become created');
                                }
                                if (newRecord.isChanged()) {
                                    throw new Error('The record should become unchanged');
                                }
                                if (!newRecord.getKey()) {
                                    throw new Error('The record should become having a key');
                                }

                                service.read(changedRecord.getKey()).addCallbacks(function(changedRecordToo) {
                                    if (changedRecord.get('Фамилия') !== changedRecordToo.get('Фамилия')) {
                                        done(new Error('The source still have an old data'));
                                    } else {
                                        service.read(deletedRecord.getKey()).addCallbacks(function() {
                                            done(new Error('The record still exists'));
                                        }, function() {
                                            service.read(newRecord.getKey()).addCallbacks(function() {
                                                done();
                                            }, function(err) {
                                                done(err);
                                            });
                                        });
                                    }
                                }, function(err) {
                                    done(err);
                                });
                            } catch (err) {
                                done(err);
                            }
                        }, function(err) {
                            done(err);
                        });
                    });
                });
            });

            describe('.query()', function() {
                it('should return a valid dataset', function(done) {
                    service.query(
                        {},
                        []
                    ).addCallbacks(function(ds) {
                            try {
                                if (!(ds instanceof DataSet)) {
                                    throw new Error('That\'s no dataset');
                                }
                                if (ds.getCount() != data.length) {
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

                context('when the strong filter applied', function() {
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
                    }];
                    for (var i = 0; i < tests.length; i++) {
                        (function(test, num) {
                            it('#' + num + ' should return ' + test.expect + ' record(s)', function(done) {
                                service.query(
                                    test.filter,
                                    [],
                                    test.offset,
                                    test.limit
                                ).addCallbacks(function(ds) {
                                        if (ds.getCount() === test.expect) {
                                            done();
                                        } else {
                                            done(new Error(ds.getCount() + ' expect to be ' + test.expect));
                                        }
                                    }, function(err) {
                                        done(err);
                                    });
                            });
                        })(tests[i], 1 + i);
                    }
                });

                context('when the custom filter applied', function() {
                    var tests = [{
                        filter: {'Должность': 'инженер'},
                        expect: 2
                    }, {
                        filter: {'Фамилия': 'нов$'},
                        expect: 3
                    }, {
                        filter: {'Фамилия': '[нр]ов'},
                        expect: 5
                    }, {
                        filter: {'Фамилия': '[нр]ов'},
                        limit: 2,
                        expect: 2
                    }, {
                        filter: {'Фамилия': '[нр]ов'},
                        offset: 4,
                        limit: 2,
                        expect: 1
                    }, {
                        filter: {'Имя': '^федор'},
                        expect: 2
                    }];
                    for (var i = 0; i < tests.length; i++) {
                        (function(test, num) {
                            it('#' + num + ' should return ' + test.expect + ' record(s)', function(done) {
                                service.setDataFilterCallback(function(filterField, dataValue, filterValue) {
                                    return new RegExp(filterValue, 'i').test(dataValue);
                                });
                                service.query(
                                    test.filter,
                                    [],
                                    test.offset,
                                    test.limit
                                ).addCallbacks(function(ds) {
                                        if (ds.getCount() === test.expect) {
                                            done();
                                        } else {
                                            done(new Error(ds.getCount() + ' expect to be ' + test.expect));
                                        }
                                    }, function(err) {
                                        done(err);
                                    });
                            });
                        })(tests[i], 1 + i);
                    }
                });

                context('when sorting applied', function() {
                    var tests = [{
                        sorting: [{'Ид': 'ASC'}],
                        check: 'Ид',
                        expect: [1, 2, 3, 4, 5, 6, 7]
                    }, {
                        sorting: [{'Ид': 'DESC'}],
                        check: 'Ид',
                        expect: [7, 6, 5, 4, 3, 2, 1]
                    }, {
                        sorting: [{'Ид': 'ASC'}],
                        offset: 2,
                        check: 'Ид',
                        expect: [3, 4, 5, 6, 7]
                    }, {
                        sorting: [{'Ид': 'DESC'}],
                        offset: 2,
                        check: 'Ид',
                        expect: [5, 4, 3, 2, 1]
                    }, {
                        sorting: [{'Ид': 'ASC'}],
                        limit: 4,
                        check: 'Ид',
                        expect: [1, 2, 3, 4]
                    }, {
                        sorting: [{'Ид': 'DESC'}],
                        limit: 4,
                        check: 'Ид',
                        expect: [7, 6, 5, 4]
                    }, {
                        sorting: [{'Ид': 'ASC'}],
                        offset: 3,
                        limit: 2,
                        check: 'Ид',
                        expect: [4, 5, 6]
                    }, {
                        sorting: [{'Ид': 'DESC'}],
                        offset: 3,
                        limit: 2,
                        check: 'Ид',
                        expect: [4, 3]
                    }, {
                        sorting: [{'Фамилия': 'ASC'}],
                        limit: 3,
                        check: 'Фамилия',
                        expect: ['Аксенова', 'Афанасьев', 'Баранов']
                    }, {
                        sorting: [{'Фамилия': 'DESC'}],
                        limit: 3,
                        check: 'Фамилия',
                        expect: ['Петров', 'Иванов', 'Иванов']
                    }, {
                        sorting: [{'Имя': 'DESC'}],
                        limit: 4,
                        check: 'Имя',
                        expect: ['Ян', 'Федора', 'Федор', 'Иванко']
                    }, {
                        sorting: [{'Фамилия': 'ASC'}, {'Имя': 'DESC'}],
                        check: ['Фамилия', 'Имя'],
                        expect: ['Аксенова+Федора', 'Афанасьев+Иван', 'Баранов+Иванко', 'Годолцов+Иван', 'Иванов+Ян', 'Иванов+Иван', 'Петров+Федор']
                    }, {
                        sorting: [{'Имя': 'ASC'}, {'Отчество': 'ASC'}],
                        limit: 5,
                        check: ['Имя', 'Отчество'],
                        expect: ['Иван+Андреевич', 'Иван+Викторович', 'Иван+Иванович', 'Иванко+Петрович', 'Федор+Иванович']
                    }, {
                        sorting: [{'Имя': 'ASC'}, {'Отчество': 'DESC'}],
                        limit: 5,
                        check: ['Имя', 'Отчество'],
                        expect: ['Иван+Иванович', 'Иван+Викторович', 'Иван+Андреевич', 'Иванко+Петрович', 'Федор+Иванович']
                    }, {
                        sorting: [{'Должность': 'ASC'}, {'Фамилия': 'ASC'}, {'Имя': 'ASC'}],
                        check: ['Должность', 'Фамилия', 'Имя'],
                        expect: ['Директор+Афанасьев+Иван', 'Директор+Годолцов+Иван', 'Директор+Петров+Федор', 'Инженер+Аксенова+Федора', 'Инженер+Иванов+Иван', 'Карапуз+Баранов+Иванко', 'Маркетолог+Иванов+Ян']
                    }];

                    for (var i = 0; i < tests.length; i++) {
                        (function(test, num) {
                            if (!(test.check instanceof Array)) {
                                test.check = [test.check];
                            }

                            it('#' + num + ' should return ' + test.expect + ' records order', function(done) {
                                service.query(
                                    test.filter,
                                    test.sorting,
                                    test.offset,
                                    test.limit
                                ).addCallbacks(function(ds) {
                                        var recordNum = 0,
                                            failOn;
                                        ds.each(function(record) {
                                            if (failOn === undefined) {
                                                var have = [],
                                                    need = test.expect[recordNum];
                                                for (var j = 0; j < test.check.length; j++) {
                                                    have.push(record.get(test.check[j]));
                                                }
                                                have = have.join('+');
                                                if (have != need) {
                                                    failOn = [have, need];
                                                }
                                            }
                                            recordNum++;
                                        });
                                        if (failOn) {
                                            done(new Error('The record with value "' + failOn[0] + '" has been found. Expect to be "' + failOn[1] + '".'));
                                        } else {
                                            done();
                                        }
                                    }, function(err) {
                                        done(err);
                                    });
                            });
                        })(tests[i], 1 + i);
                    }
                });
            });
        });
    }
);
