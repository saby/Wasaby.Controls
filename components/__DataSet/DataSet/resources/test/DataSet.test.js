/* global beforeEach, afterEach, describe, context, it, assert */
define(
    ['js!SBIS3.CONTROLS.DataSet', 'js!SBIS3.CONTROLS.Record', 'js!SBIS3.CONTROLS.ArrayStrategy'],
    function (DataSet, Record, ArrayStrategy) {
        describe('SBIS3.CONTROLS.DataSet', function() {
            var data,
                dataSetInstance,
                recordInstance;

            beforeEach(function() {
                data = [{
                    'Ид': 1,
                    'Фамилия': 'Иванов',
                    'Имя': 'Иван',
                    'Отчество': 'Иванович',
                    'Должность': 'Инженер'
                }, {
                    'Ид': 2,
                    'Фамилия': 'Петров',
                    'Имя': 'Федор',
                    'Отчество': 'Иванович',
                    'Должность': 'Директор'
                }, {
                    'Ид': 3,
                    'Фамилия': 'Сидоров',
                    'Имя': 'Федора',
                    'Отчество': 'Сергеевна',
                    'Должность': 'Инженер'
                }, {
                    'Ид': 4,
                    'Фамилия': 'Пухов',
                    'Имя': 'Иван',
                    'Отчество': 'Андреевич',
                    'Должность': 'Директор'
                }, {
                    'Ид': 5,
                    'Фамилия': 'Молодцов',
                    'Имя': 'Михаил',
                    'Отчество': 'Петрович',
                    'Должность': 'Карапуз'
                }, {
                    'Ид': 6,
                    'Фамилия': 'Годолцов',
                    'Имя': 'Иван',
                    'Отчество': 'Викторович',
                    'Должность': 'Директор'
                }, {
                    'Ид': 7,
                    'Фамилия': 'Арбузнов',
                    'Имя': 'Иванко',
                    'Отчество': 'Яковлевич',
                    'Должность': 'Маркетолог'
                }];

                dataSetInstance = new DataSet({
                    strategy: new ArrayStrategy(),
                    data: data,
                    keyField: 'Ид'
                });

                recordInstance = new Record({
                    strategy: new ArrayStrategy(),
                    raw: {
                        'Ид': 10,
                        'Фамилия': 'Новиков',
                        'Имя': 'Дмитрий',
                        'Отчество': 'Владимирович',
                        'Должность': 'Директор'
                    },
                    keyField: 'Ид'
                });
            });

            afterEach(function() {
                data = undefined;
                dataSetInstance = undefined;
                recordInstance = undefined;
            });

            describe('.$constructor()', function() {
                it('should able to create an empty dataset', function() {
                    assert.doesNotThrow(function() {
                        dataSetInstance = new DataSet({
                            strategy: new ArrayStrategy()
                        });
                    });
                });
            });

            describe('.getCount()', function() {
                context('when filled', function() {
                    it('should return records count', function() {
                        assert.equal(data.length, dataSetInstance.getCount());
                    });
                });

                context('when empty', function() {
                    it('should return 0', function() {
                        assert.strictEqual(
                            0,
                            (new DataSet({
                                strategy: new ArrayStrategy(),
                                data: []
                            })).getCount()
                        );
                    });
                });
            });

            describe('.each()', function() {
                it('should return records with keys', function() {
                    var hasKey = null;
                    dataSetInstance.each(function(record) {
                        if (hasKey === null) {
                            hasKey = true;
                        }
                        if (!record.getKey()) {
                            hasKey = false;
                        }
                    });
                    assert.isTrue(hasKey);
                });

                context('when regular', function() {
                    it('should not return deleted record', function() {
                        dataSetInstance.removeRecord(6);
                        dataSetInstance.each(function(record) {
                            if (record.isDeleted()) {
                                throw new Error('Record is deleted');
                            }
                        });
                    });
                });

                context('when filtered', function() {
                    it('should return all records', function() {
                        var count = 0;
                        dataSetInstance.removeRecord(6);
                        dataSetInstance.each(function() {
                            count++;
                        }, 'all');
                        assert.equal(data.length, count);
                    });

                    it('should return only created records', function() {
                        dataSetInstance.push({
                            'Фамилия': 'Флеминг',
                            'Имя': 'Ян'
                        });
                        var onlyCreated = true,
                            hasRecords = false;
                        dataSetInstance.each(function(record) {
                            hasRecords = true;
                            if (!record.isCreated()) {
                                onlyCreated = false;
                            }
                        }, 'created');
                        assert.isTrue(hasRecords && onlyCreated);
                    });

                    it('should return only deleted records', function() {
                        var onlyDeleted = true,
                            hasRecords = false;
                        dataSetInstance.removeRecord(6);
                        dataSetInstance.each(function(record) {
                            hasRecords = true;
                            if (!record.isDeleted()) {
                                onlyDeleted = false;
                            }
                        }, 'deleted');
                        assert.isTrue(hasRecords && onlyDeleted);
                    });

                    it('should return only changed records', function() {
                        var onlyChanged = true,
                            hasRecords = false;
                        dataSetInstance.getRecordByKey(2).set('Должность', 'Лифтер');
                        dataSetInstance.each(function(record) {
                            hasRecords = true;
                            if (!record.isChanged()) {
                                onlyChanged = false;
                            }
                        }, 'changed');
                        assert.isTrue(hasRecords && onlyChanged);
                    });
                });
            });

            describe('.getRecordKeyByIndex()', function() {
                context('when exists', function() {
                    it('should return the key', function() {
                        assert.equal(
                            5,
                            dataSetInstance.getRecordKeyByIndex(4)
                        );
                    });
                });

                context('when not exists', function() {
                    it('should return undefined', function() {
                        assert.strictEqual(
                            undefined,
                            dataSetInstance.getRecordKeyByIndex(99)
                        );
                    });
                });
            });

            describe('.at()', function() {
                context('when exists', function() {
                    it('should return the record', function() {
                        assert.equal(
                            3,
                            dataSetInstance.at(2).get('Ид')
                        );
                    });
                });

                context('when not exists', function() {
                    it('should return undefined', function() {
                        assert.strictEqual(
                            undefined,
                            dataSetInstance.at(-1)
                        );
                    });
                });
            });


            describe('.getRecordByKey()', function() {
                context('when exists', function() {
                    it('should return the record with given key', function() {
                        assert.equal(
                            2,
                            dataSetInstance.getRecordByKey(2).getKey()
                        );
                    });

                    it('should return the record with given field', function() {
                        assert.equal(
                            'Петров',
                            dataSetInstance.getRecordByKey(2).get('Фамилия')
                        );
                    });
                });

                context('when not exists', function() {
                    it('should return undefined', function() {
                        assert.strictEqual(
                            undefined,
                            dataSetInstance.getRecordByKey(666)
                        );
                    });
                });
            });

            describe('.removeRecord()', function() {
                context('when exists', function() {
                    it('should apply isDeleted() mark', function() {
                        dataSetInstance.removeRecord(3);
                        assert.isTrue(dataSetInstance.getRecordByKey(3).isDeleted());

                        dataSetInstance.removeRecord([2, 5]);
                        assert.isTrue(dataSetInstance.getRecordByKey(2).isDeleted());
                        assert.isTrue(dataSetInstance.getRecordByKey(5).isDeleted());
                    });
                });

                context('when not exists', function() {
                    it('should do nothing', function() {
                        dataSetInstance.removeRecord(777);
                        assert.strictEqual(
                            undefined,
                            dataSetInstance.getRecordByKey(777)
                        );
                    });
                });

            });

            describe('.push()', function() {
                it('should add the record to the last position', function() {
                    dataSetInstance.push(recordInstance);
                    assert.strictEqual(
                        recordInstance,
                        dataSetInstance.at(dataSetInstance.getCount() - 1)
                    );
                });

                it('should be operable with raw data', function() {
                    dataSetInstance.push({
                        'Ид': 100,
                        'Фамилия': 'Мересьев',
                        'Имя': 'Алексей',
                        'Отчество': 'Петрович'
                    });
                    assert.strictEqual(
                        100,
                        dataSetInstance.at(dataSetInstance.getCount() - 1).getKey()
                    );
                });
            });

            describe('.insert()', function() {
                it('should insert the record to the 5 position', function() {
                    dataSetInstance.insert(recordInstance, 5);
                    assert.strictEqual(
                        recordInstance,
                        dataSetInstance.at(5)
                    );
                });
            });

            describe('.merge()', function() {
                var data2Merge,
                    dataSet2Merge;

                beforeEach(function() {
                    data2Merge = [{
                        'Ид': 2,
                        'Фамилия': 'Петров(m)',
                        'Имя': 'Федор(m)',
                        'Отчество': 'Иванович(m)',
                        'Должность': 'Директор(m)'
                    }, {
                        'Ид': 5,
                        'Фамилия': 'Молодцов(m)',
                        'Имя': 'Михаил(m)',
                        'Отчество': 'Петрович(m)',
                        'Должность': 'Карапуз(m)'
                    }, {
                        'Ид': 6,
                        'Фамилия': 'Годолцов(m)',
                        'Имя': 'Иван(m)',
                        'Отчество': 'Викторович(m)',
                        'Должность': 'Директор(m)'
                    }, {
                        'Ид': 10,
                        'Фамилия': 'Новиков(m)',
                        'Имя': 'Дмитрий(m)',
                        'Отчество': 'Владимирович(m)',
                        'Должность': 'Директор(m)'
                    }, {
                        'Ид': 15,
                        'Фамилия': 'Смирнов(m)',
                        'Имя': 'Анатолий(m)',
                        'Отчество': 'Михайлович(m)',
                        'Должность': 'Директор(m)'
                    }];
                    dataSet2Merge = new DataSet({
                        strategy: new ArrayStrategy(),
                        data: data2Merge,
                        keyField: 'Ид'
                    });
                });

                afterEach(function() {
                    data2Merge = undefined;
                    dataSet2Merge = undefined;
                });

                it('should change records count', function() {
                    var oldCount = dataSetInstance.getCount();
                    dataSetInstance.merge(dataSet2Merge);
                    assert.equal(
                        oldCount + 2,
                        dataSetInstance.getCount()
                    );
                });

                it('should change given field of the record', function() {
                    dataSetInstance.merge(dataSet2Merge);
                    assert.equal(
                        'Иван(m)',
                        dataSetInstance.getRecordByKey(6).get('Имя')
                    );
                });

                it('should add a new unique records', function() {
                    dataSetInstance.merge(dataSet2Merge);
                    assert.equal(
                        10,
                        dataSetInstance.getRecordByKey(10).get('Ид')
                    );
                });

                it('should able to merge without own key field', function() {
                    var ds = new DataSet({
                        strategy: new ArrayStrategy()
                    });
                    ds.merge(dataSet2Merge);
                    assert.equal(
                        ds.getCount(),
                        dataSet2Merge.getCount()
                    );
                });

                it('should able to merge without a key value of external records', function() {
                    var ds = new DataSet({
                        strategy: new ArrayStrategy(),
                        data: [{
                            'Фамилия': 'Воробъянинов',
                            'Имя': 'Киса'
                        }]
                    });
                    dataSetInstance.merge(ds);
                    assert.isDefined(
                        dataSetInstance.at(dataSetInstance.getCount() - 1).getKey()
                    );
                    assert.equal(
                        'Воробъянинов',
                        dataSetInstance.at(dataSetInstance.getCount() - 1).get('Фамилия')
                    );
                });
            });

            describe('.setRawData()', function() {
                var dataNew;

                beforeEach(function() {
                    dataNew = [{
                        'Ид': 2,
                        'Фамилия': 'Петров(m)',
                        'Имя': 'Федор(m)',
                        'Отчество': 'Иванович(m)',
                        'Должность': 'Директор(m)'
                    }, {
                        'Ид': 10,
                        'Фамилия': 'Новиков(m)',
                        'Имя': 'Дмитрий(m)',
                        'Отчество': 'Владимирович(m)',
                        'Должность': 'Директор(m)'
                    }];
                });

                afterEach(function() {
                    dataNew = undefined;
                });

                it('should change records count', function() {
                    dataSetInstance.setRawData(dataNew);
                    assert.equal(
                        2,
                        dataSetInstance.getCount()
                    );
                });

                it('should add the new record', function() {
                    dataSetInstance.setRawData(dataNew);
                    assert.equal(
                        'Новиков(m)',
                        dataSetInstance.getRecordByKey(10).get('Фамилия')
                    );
                });

                it('should remove the old record', function() {
                    dataSetInstance.setRawData(dataNew);
                    assert.strictEqual(
                        undefined,
                        dataSetInstance.getRecordByKey(3)
                    );
                });
            });
        });
    }
);
