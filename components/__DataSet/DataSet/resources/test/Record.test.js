/* global requirejs, beforeEach, afterEach, describe, context, it, assert */
define(
    ['js!SBIS3.CONTROLS.Record', 'js!SBIS3.CONTROLS.ArrayStrategy'],
    function (Record, ArrayStrategy) {
        describe('SBIS3.CONTROLS.Record', function() {
            var data,
                recordInstance;

            beforeEach(function beforeEachDataSet() {
                data = {
                    'Ид': 7,
                    'Фамилия': 'Иванов',
                    'Имя': 'Иван',
                    'Возраст': 25
                };
                recordInstance = new Record({
                    strategy: new ArrayStrategy(),
                    raw: data,
                    keyField: 'Ид'
                });
            });

            afterEach(function afterEachDataSet() {
                data = undefined;
                recordInstance = undefined;
            });

            describe('.merge()', function() {
                it('should return the new field value', function() {
                    recordInstance.merge(new Record({
                        strategy: new ArrayStrategy(),
                        raw: {
                            'Фамилия': 'Петров'
                        }
                    }));
                    assert.equal(
                        'Петров',
                        recordInstance.get('Фамилия')
                    );
                });

                it('should return the new state value', function() {
                    var anotherRecord = new Record({
                        strategy: new ArrayStrategy(),
                        raw: {
                            'Фамилия': 'Петров'
                        }
                    });
                    anotherRecord.set('Фамилия', 'Водкин');
                    recordInstance.merge(anotherRecord);
                    assert.isTrue(recordInstance.isChanged());
                });
            });

            describe('.get()', function() {
                context('when the field is defined', function() {
                    it('should return a value', function() {
                        assert.equal(
                            'Иван',
                            recordInstance.get('Имя')
                        );
                        assert.equal(
                            25,
                            recordInstance.get('Возраст')
                        );
                    });
                });

                context('when the field is undefined', function() {
                    it('should return an undefined value', function() {
                        assert.strictEqual(
                            undefined,
                            recordInstance.get('Имя1')
                        );
                    });

                });
                context('when the field name is empty', function() {
                    it('should don\'t throw an Error', function() {
                        assert.doesNotThrow(function() {
                            recordInstance.get('');
                        });
                        assert.doesNotThrow(function() {
                            recordInstance.get();
                        });
                    });
                });
            });

            describe('.set()', function() {
                context('when the field is defined', function() {
                    it('should change the value', function() {
                        recordInstance.set('Имя', 'Вольдемар');
                        assert.equal(
                            'Вольдемар',
                            recordInstance.get('Имя')
                        );
                    });
                });

                context('when the field is undefined', function() {
                    it('should set the value anyway', function() {
                        recordInstance.set('Пол', 'м');
                        assert.equal(
                            'м',
                            recordInstance.get('Пол')
                        );
                    });
                });

                context('when the field name is empty', function() {
                    it('should don\'t an Error', function() {
                        assert.doesNotThrow(function() {
                            recordInstance.set('', 'м');
                        });
                        assert.doesNotThrow(function() {
                            recordInstance.set(undefined, 'м');
                        });
                    });
                });
            });

            describe('.getType()', function() {
                context('when the field is defined', function() {
                    it('should return a type', function() {
                        assert.equal(
                            'Текст',
                            recordInstance.getType('Ид')
                        );
                        assert.equal(
                            'Текст',
                            recordInstance.getType('Имя')
                        );
                    });
                });

                context('when the field is undefined', function() {
                    it('should return undefined', function() {
                        assert.strictEqual(
                            undefined,
                            recordInstance.getType('Пол')
                        );
                    });
                });
            });

            describe('.isCreated()', function() {
                context('when the record is not from the data source', function() {
                    it('should return false', function() {
                        assert.isFalse(recordInstance.isCreated());
                    });
                });

                it('should can change', function() {
                    recordInstance.setCreated(true);
                    assert.isTrue(recordInstance.isCreated());
                });
            });

            describe('.isDeleted()', function() {
                it('should return false by default', function() {
                    assert.isFalse(recordInstance.isDeleted());
                });

                it('should can change', function() {
                    recordInstance.setDeleted(true);
                    assert.isTrue(recordInstance.isDeleted());
                });
            });

            describe('.isChanged()', function() {
                it('should return false by default', function() {
                    assert.isFalse(recordInstance.isChanged());
                });

                it('should can change', function() {
                    recordInstance.setChanged(true);
                    assert.isTrue(recordInstance.isChanged());
                });

                it('should take effect by set the new field value', function() {
                    recordInstance.set('Возраст', 26);
                    assert.isTrue(recordInstance.isChanged());
                });
            });

            describe('.getKey()', function() {
                it('should return the key field value', function() {
                    assert.equal(
                        7,
                        recordInstance.getKey()
                    );
                });
            });

            describe('.getKeyField()', function() {
                it('should return the key field name', function() {
                    assert.equal(
                        'Ид',
                        recordInstance.getKeyField()
                    );
                });
            });

            describe('.getRaw()', function() {
                it('should return raw data', function() {
                    assert.strictEqual(
                        data,
                        recordInstance.getRaw()
                    );
                });
            });
        });
    }
);
