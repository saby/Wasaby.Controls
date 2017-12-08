/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
    'js!SBIS3.CONTROLS.SbisMenu',
    'WS.Data/Collection/RecordSet',
    'WS.Data/Adapter/Sbis',
    'WS.Data/Entity/Model'
    ],

    function (SbisMenu, RecordSet, SbisAdapter, Model) {

    'use strict';
    var
        newId = null,
        myItem = new Model({
            rawData: {
                _type: 'record',
                d: ['8', 'Обучение', null, true, false, true, '8', true, false],
                s: [
                    {n: 'id', t: 'Строка'},
                    {n: 'title', t: 'Строка'},
                    {n: 'Parent', t: 'Строка'},
                    {n: 'visible', t: 'Логическое'},
                    {n: 'pinned', t: 'Логическое'},
                    {n: 'historyItem', t: 'Логическое'},
                    {n: 'historyId', t: 'Строка'},
                    {n: 'groupSeparator', t: 'Логическое'},
                    {n: 'additional', t: 'Логическое'}
                ]
            },
            adapter: new SbisAdapter(),
            idProperty: 'historyId',
            format: [
                {name: 'id', type: 'string'},
                {name: 'title', type: 'string'},
                {name: 'Parent', type: 'string'},
                {name: 'visible', type: 'boolean'},
                {name: 'pinned', type: 'boolean'},
                {name: 'historyItem', type: 'boolean'},
                {name: 'historyId', type: 'string'},
                {name: 'groupSeparator', type: 'boolean'},
                {name: 'additional', type: 'boolean'}
            ]
        }),
        myFormat = [
            {name: 'id', type: 'string'},
            {name: 'title', type: 'string'}
        ],
        myData = {
            _type: 'recordset',
            d: [
                [
                    '1', 'Задача в разработку', null
                ],
                [
                    '2', 'Ошибка в разработку', null
                ],
                [
                    '3', 'Поручение', null
                ],
                [
                    '4', 'Выполнить на боевом', null
                ],
                [
                    '5', 'Согласование', 2
                ],
                [
                    '6', 'Заявки', 2
                ],
                [
                    '7', 'Продажи', null
                ],
                [
                    '8', 'Обучение', null
                ],
                [
                    '9', 'Документация', null
                ],
                [
                    '10', 'Согласование отгула', null
                ],
                [
                    '11', 'Новый регламент', null
                ],
                [
                    '12', 'Прогул', null
                ]
            ],
            s: [
                {n: 'id', t: 'Строка'},
                {n: 'title', t: 'Строка'},
                {n: 'Parent', t: 'Строка'}
            ]
        },
        myRecord = new RecordSet({
            rawData: myData,
            idProperty: 'id',
            adapter: new SbisAdapter(),
            format: myFormat
        }),
        rawHistoryDataWidthEmptyPinned = {
            pinned: [],
            frequent: [1, 4, 5, 7],
            recent: [1, 3, 4, 5, 7, 8]
        },
        rawHistoryData = {
            pinned: [1, 5],
            frequent: [1, 4, 5, 7],
            recent: [1, 3, 4, 5, 7, 8]
        },
        data = {
            rawData: null,
            setRawData: function (data) {
                this.rawData = data;
            },
            getRow: function() {
                return {
                    rawData: this.rawData,
                    get: function(type) {
                        return this.rawData[type];
                    }
                }
            }
        },
        self = {
            _options: {
                additionalProperty: 'additional',
                parentProperty: 'Parent',
                displayProperty: 'title',
                pinned: true,
                frequent: true
            },
            _subContainers: ['2'],
            _oldItems: myRecord,
            _pinned: new RecordSet({
                rawData: {
                    _type: 'recordset',
                    d: [
                        [
                            '1', 'Задача в разработку', null
                        ],
                        [
                            '5', 'Согласование', 2
                        ],
                        [
                            '12', 'Прогул', null
                        ]
                    ],
                    s: [
                        {n: 'id', t: 'Строка'},
                        {n: 'title', t: 'Строка'},
                        {n: 'Parent', t: 'Строка'}
                    ]
                },
                idProperty: 'id',
                adapter: new SbisAdapter(),
                format: myFormat
            }),
            _recent: new RecordSet({
                rawData: {
                    _type: 'recordset',
                    d: [
                        [
                            '1', 'Задача в разработку', null
                        ],
                        [
                            '3', 'Поручение', null
                        ],
                        [
                            '4', 'Выполнить на боевом', null
                        ],
                        [
                            '5', 'Согласование', 2
                        ],
                        [
                            '7', 'Продажи', null
                        ],
                        [
                            '8', 'Обучение', null
                        ]
                    ],
                    s: [
                        {n: 'id', t: 'Строка'},
                        {n: 'title', t: 'Строка'},
                        {n: 'Parent', t: 'Строка'}
                    ]
                },
                idProperty: 'id',
                adapter: new SbisAdapter(),
                format: myFormat
            }),
            _frequent: new RecordSet({
                rawData: {
                    _type: 'recordset',
                    d: [
                        [
                            '1', 'Задача в разработку', null
                        ],
                        [
                            '4', 'Выполнить на боевом', null
                        ],
                        [
                            '5', 'Согласование', 2
                        ],
                        [
                            '7', 'Продажи', null
                        ]
                    ],
                    s: [
                        {n: 'id', t: 'Строка'},
                        {n: 'title', t: 'Строка'},
                        {n: 'Parent', t: 'Строка'}
                    ]
                },
                idProperty: 'id',
                adapter: new SbisAdapter(),
                format: myFormat
            })
        },
        item;

    describe('SBIS3.CONTROLS.SbisMenu', function () {
        describe('getOriginId', function () {
            it('pinned', function () {
                newId = SbisMenu._private.getOriginId('pinned-27313bd6-bc02-11e4-a1dd-00505691577e');
                assert.equal(newId, '27313bd6-bc02-11e4-a1dd-00505691577e');
            });
            it('frequent', function () {
                newId = SbisMenu._private.getOriginId('frequent-51350476-f4a0-4980-8f9d-159b683dfc0d');
                assert.equal(newId, '51350476-f4a0-4980-8f9d-159b683dfc0d');
            });
            it('recent', function () {
                newId = SbisMenu._private.getOriginId('recent-d9ec5157-d563-4243-b8e7-0d3f8c95c0cf');
                assert.equal(newId, 'd9ec5157-d563-4243-b8e7-0d3f8c95c0cf');
            });
            it('origin', function () {
                newId = SbisMenu._private.getOriginId('8da8666c-8106-43ef-9d62-a58433832558');
                assert.equal(newId, '8da8666c-8106-43ef-9d62-a58433832558');
            });
        });

        describe('prepareRecordSet', function () {
            it('check with empty pinned items', function () {
                SbisMenu._private.initRecordSet(self, self._oldItems.getFormat());
                data.setRawData(rawHistoryDataWidthEmptyPinned);
                SbisMenu._private.parseHistoryData(self, data);
                assert.equal(self._pinned.getFormat().getCount(), self._oldItems.getFormat().getCount());
            });
            it('parseHistoryData', function () {
                SbisMenu._private.initRecordSet(self, self._oldItems.getFormat());
                data.setRawData(rawHistoryData);
                SbisMenu._private.parseHistoryData(self, data);
                SbisMenu._private.prepareHistoryData(self);
                assert.equal(self._pinned.getFormat().getCount(), self._oldItems.getFormat().getCount());
            });

            it('init recordSet', function () {
                item = self._pinned.getRecordById('pinned-1');
                assert.equal(item.get('title'), 'Задача в разработку');
                assert.equal(item.get('visible'), true);
                assert.equal(item.get('pinned'), false);
                assert.equal(item.get('historyItem'), true);
                assert.equal(item.get('historyId'), 'pinned-1');
                assert.equal(item.get('groupSeparator'), false);
                assert.equal(item.get('additional'), false);
                assert.equal(myRecord.getIdProperty(), 'historyId');
            });

            it('getEmptyHistoryRecord', function () {
                var myFormat = [
                    {name: 'id', type: 'string'},
                    {name: 'title', type: 'string'},
                    {name: 'myOption', type: 'boolean'}
                ],
                newEmptyRecord;

                newEmptyRecord = SbisMenu._private.getEmptyHistoryRecord(self, myFormat);
                assert.equal(newEmptyRecord.getFormat().getCount(), 3);
                assert.equal(newEmptyRecord.getCount(), 0);
            });
        });
        describe('fill History', function () {
            it('filterRecent', function () {
                var filterRecent;

                filterRecent = SbisMenu._private.filterRecent(self);
                assert.equal(filterRecent.length, 2);
            });
            it('filterFrequent', function () {
                var filterFrequent;

                filterFrequent = SbisMenu._private.filterFrequent(self);
                assert.equal(filterFrequent.length, 2);
            });
            it('processHistory, check additional', function () {
                var hiddenByPinItem,
                    processedItems;

                processedItems = SbisMenu._private.processHistory(self);
                hiddenByPinItem = processedItems.getRecordById('12');
                assert.equal(processedItems.getCount(), 19);
                // проверяем что элемент, который скрыли в истории не скрыли ещё раз дополнительный >10 видимых элементов
                assert.equal(hiddenByPinItem.get(self._options.additionalProperty), false);

            });
            it('addToRecent', function () {
                var recentItem;

                SbisMenu._private.addToRecent(self, myItem.getId(), myItem);
                recentItem = self._recent.at(0);
                assert.equal(recentItem.get('title'), 'Обучение');
            });
            it('processPinnedItem pin: false', function () {
                var idPickItem = 'pinned-1',
                    pickItem = self._pinned.getRecordById(idPickItem),
                    pinned, oldItem;

                pinned = SbisMenu._private.processPinnedItem(self, idPickItem, SbisMenu._private.getOriginId(idPickItem), pickItem);
                oldItem = self._oldItems.getRecordById(SbisMenu._private.getOriginId(idPickItem));
                assert.equal(pinned, false);
                assert.equal(oldItem.get('title'), pickItem.get('title'));
                assert.equal(oldItem.get('visible'), true);
                assert.equal(oldItem.get('pinned'), false);
            });
            it('processPinnedItem pin: true', function () {
                var pickItem = self._oldItems.getRecordById('8'),
                    pinnedItem, pinned;

                pinned = SbisMenu._private.processPinnedItem(self, pickItem.getId(), SbisMenu._private.getOriginId(pickItem.getId()), pickItem);
                pinnedItem = self._pinned.at(self._pinned.getCount() - 1);
                assert.equal(pinnedItem.get('title'), 'Обучение');
                assert.equal(pinned, true);
                assert.equal(pickItem.get('visible'), false);
            });
        });
    });
});