/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'SBIS3.CONTROLS/Menu/SBISHistoryController',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Adapter/Sbis',
   'WS.Data/Entity/Model'
],

function(SBISHistoryController, RecordSet, SbisAdapter, Model) {

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
         {name: 'title', type: 'string'},
         {name: 'Parent', type: 'string'},
         {name: 'visible', type: 'boolean'}
      ],
      myData = {
         _type: 'recordset',
         d: [
            [
               '1', 'Задача в разработку', null, true
            ],
            [
               '2', 'Ошибка в разработку', null, true
            ],
            [
               '3', 'Поручение', null, true
            ],
            [
               '4', 'Выполнить на боевом', null, true
            ],
            [
               '5', 'Согласование', 2, false
            ],
            [
               '6', 'Заявки', 2, true
            ],
            [
               '7', 'Продажи', null, true
            ],
            [
               '8', 'Обучение', null, true
            ],
            [
               '9', 'Документация', null, true
            ],
            [
               '10', 'Согласование отгула', null, true
            ],
            [
               '11', 'Новый регламент', null, true
            ],
            [
               '12', 'Прогул', null, true
            ]
         ],
         s: [
            {n: 'id', t: 'Строка'},
            {n: 'title', t: 'Строка'},
            {n: 'Parent', t: 'Строка'},
            {n: 'visible', t: 'Логический'}
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
         pinned: [1, 5, 12],
         frequent: [1, 4, 5, 7],
         recent: [1, 3, 4, 5, 7, 8]
      },
      data = {
         rawData: null,
         setRawData: function(data) {
            this.rawData = data;
         },
         getRow: function() {

            return {
               rawData: this.rawData,
               get: function(type) {
                  return this.rawData[type];
               }
            };
         }
      },
      frequent,
      self = {
         _options: {
            additionalProperty: 'additional',
            parentProperty: 'Parent',
            displayProperty: 'title',
            pinned: true,
            frequent: true,
            oldItems: myRecord
         },
         _filteredFrequent: null,
         _subContainers: ['2'],
         _oldItems: myRecord,
         _pinned: new RecordSet({
            rawData: {
               _type: 'recordset',
               d: [
                  [
                     'pinned-1', 'Задача в разработку', null, true
                  ],
                  [
                     'pinned-5', 'Согласование', 2, true
                  ],
                  [
                     'pinned-12', 'Прогул', null, true
                  ]
               ],
               s: [
                  {n: 'id', t: 'Строка'},
                  {n: 'title', t: 'Строка'},
                  {n: 'Parent', t: 'Строка'},
                  {n: 'visible', t: 'Логический'}
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
                     '1', 'Задача в разработку', null, true
                  ],
                  [
                     '3', 'Поручение', null, true
                  ],
                  [
                     '4', 'Выполнить на боевом', null, true
                  ],
                  [
                     '5', 'Согласование', 2, true
                  ],
                  [
                     '7', 'Продажи', null, true
                  ],
                  [
                     '8', 'Обучение', null, true
                  ]
               ],
               s: [
                  {n: 'id', t: 'Строка'},
                  {n: 'title', t: 'Строка'},
                  {n: 'Parent', t: 'Строка'},
                  {n: 'visible', t: 'Логический'}
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
                     'frequent-1', 'Задача в разработку', null, true
                  ],
                  [
                     'frequent-4', 'Выполнить на боевом', null, true
                  ],
                  [
                     'frequent-5', 'Согласование', 2, true
                  ],
                  [
                     'frequent-7', 'Продажи', null, true
                  ]
               ],
               s: [
                  {n: 'id', t: 'Строка'},
                  {n: 'title', t: 'Строка'},
                  {n: 'Parent', t: 'Строка'},
                  {n: 'visible', t: 'Логический'}
               ]
            },
            idProperty: 'id',
            adapter: new SbisAdapter(),
            format: myFormat
         })
      },
      item,
      historyController;



   describe('SBIS3.CONTROLS/Menu/SBISHistoryController', function() {
      before(function() {
         historyController = new SBISHistoryController({
            oldItems: myRecord,
            historyId: 'myHistoryID',
            pinned: true,
            frequent: true,
            displayProperty: 'title',
            subContainers: ['2'],
            parentProperty: 'Parent',
            needHistoryId: true
         });
      });

      describe('getOriginId', function() {
         it('pinned', function() {
            newId = historyController.getOriginId('pinned-27313bd6-bc02-11e4-a1dd-00505691577e');
            assert.equal(newId, '27313bd6-bc02-11e4-a1dd-00505691577e');
         });
         it('frequent', function() {
            newId = historyController.getOriginId('frequent-51350476-f4a0-4980-8f9d-159b683dfc0d');
            assert.equal(newId, '51350476-f4a0-4980-8f9d-159b683dfc0d');
         });
         it('recent', function() {
            newId = historyController.getOriginId('recent-d9ec5157-d563-4243-b8e7-0d3f8c95c0cf');
            assert.equal(newId, 'd9ec5157-d563-4243-b8e7-0d3f8c95c0cf');
         });
         it('origin', function() {
            newId = historyController.getOriginId('8da8666c-8106-43ef-9d62-a58433832558');
            assert.equal(newId, '8da8666c-8106-43ef-9d62-a58433832558');
         });
      });

      describe('prepareRecordSet', function() {
         it('parseHistoryData', function() {
            historyController.initRecordSet();
            data.setRawData(rawHistoryData);
            historyController.parseHistoryData(data);
            historyController.prepareHistoryData();
            assert.equal(historyController._pinned.getFormat().getCount(), historyController._options.oldItems.getFormat().getCount());
         });

         it('init recordSet', function() {
            item = historyController._pinned.getRecordById('pinned-1');
            assert.equal(item.get('title'), 'Задача в разработку');
            assert.equal(item.get('visible'), true);
            assert.equal(item.get('pinned'), false);
            assert.equal(item.get('historyItem'), true);
            assert.equal(item.get('historyId'), 'pinned-1');
            assert.equal(item.get('groupSeparator'), false);
            assert.equal(item.get('additional'), false);
            assert.equal(myRecord.getIdProperty(), 'historyId');
         });

         it('getEmptyHistoryRecord', function() {
            var myFormat = [
                  {name: 'id', type: 'string'},
                  {name: 'title', type: 'string'},
                  {name: 'myOption', type: 'boolean'}
               ],
               newEmptyRecord;

            newEmptyRecord = SBISHistoryController._private.getEmptyHistoryRecord(historyController, myFormat);
            assert.equal(newEmptyRecord.getFormat().getCount(), 3);
            assert.equal(newEmptyRecord.getCount(), 0);
         });
      });
      describe('fill History', function() {
         it('filterFrequent', function() {
            historyController._options.frequent = true;
            historyController._filteredFrequent = SBISHistoryController._private.filterFrequent(historyController);
            assert.equal(historyController._filteredFrequent.getCount(), 2);
         });
         it('filterRecent', function() {
            var filterRecent;
            filterRecent = SBISHistoryController._private.filterRecent(historyController);
            assert.equal(filterRecent.getCount(), 2);
         });
         it('processHistory, check additional', function() {
            var hiddenByPinItem,
               processedItems;

            processedItems = SBISHistoryController._private.processHistory(historyController);
            hiddenByPinItem = processedItems.getRecordById('12');
            assert.equal(processedItems.getCount(), 19);

            // проверяем что элемент, который скрыли в истории не скрыли ещё раз дополнительный >10 видимых элементов
            assert.equal(hiddenByPinItem.get(historyController._options.additionalProperty), false);

         });
         it('addToRecent', function() {
            var recentItem;

            historyController.addToRecent(myItem.getId(), myItem);
            recentItem = historyController._recent.at(0);
            assert.equal(recentItem.get('title'), 'Обучение');
         });
         it('processPinnedItem pin: false', function() {
            var idPickItem = 'pinned-1',
               pickItem = historyController._pinned.getRecordById(idPickItem),
               pinned, oldItem;

            pinned = SBISHistoryController._private.processPinnedItem(historyController, SBISHistoryController._private.getOriginId(idPickItem), pickItem);
            oldItem = historyController._options.oldItems.getRecordById(SBISHistoryController._private.getOriginId(idPickItem));
            assert.equal(pinned, false);
            assert.equal(oldItem.get('title'), pickItem.get('title'));
            assert.equal(oldItem.get('visible'), true);
            assert.equal(oldItem.get('pinned'), false);
         });
         it('processPinnedItem pin: true', function() {
            var pickItem = historyController._options.oldItems.getRecordById('8'),
               pinnedItem, pinned;

            pinned = SBISHistoryController._private.processPinnedItem(historyController, SBISHistoryController._private.getOriginId(pickItem.getId()), pickItem);
            pinnedItem = historyController._pinned.at(historyController._pinned.getCount() - 1);
            assert.equal(pinnedItem.get('title'), 'Обучение');
            assert.equal(pinned, true);
            assert.equal(pickItem.get('visible'), false);
         });
         it('setPinned', function() {
            var pinnedItems = [11, 12];

            historyController.setPinned(pinnedItems);
            assert.equal(historyController._pinned.getCount(), 2);
         });
         it('setFrequent', function() {
            var frequentItems = [1, 12];

            historyController.setFrequnet(frequentItems);
            assert.equal(historyController._frequent.getCount(), 2);
         });
      });
   });
});
