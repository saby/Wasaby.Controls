/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
     ['SBIS3.CONTROLS/Action/List/Save',
      'WS.Data/Source/Memory',
      'WS.Data/Source/SbisService',
      'WS.Data/Query/Query',
      'Core/Deferred',
      'SBIS3.CONTROLS/Action/Save/SaveStrategy/Sbis',
      'WS.Data/Collection/RecordSet'],
   function (Save, Memory, SbisService, Query, Deferred, Strategy, RecordSet) {
      'use strict';

      var data = [
         {id: 1, name: 'folder 1', parent: null, 'parent@': true},
         {id: 2, name: 'leave 1-1', parent: 1, 'parent@': null},
         {id: 3, name: 'leave 1-2', parent: 1, 'parent@': null},
         {id: 4, name: 'leave 1-3', parent: 1, 'parent@': null},
         {id: 5, name: 'leave 1-4', parent: 1, 'parent@': null},
         {id: 6, name: 'leave 1', parent: null, 'parent@': null},
         {id: 7, name: 'leave 2', parent: null, 'parent@': null},
         {id: 8, name: 'leave 3', parent: null, 'parent@': null},
         {id: 9, name: 'leave 4', parent: null, 'parent@': null},
         {id: 10, name: 'leave 5', parent: null, 'parent@': null}
      ];

      var lastArgs;

      var fakeStrategy = Strategy.extend({
         exportFileTransfer: function(methodName, cfg) {
            lastArgs = {
               methodName: methodName,
               cfg: cfg
            }
         }
      });

      var recordSet = new RecordSet({
         rawData: data,
         idProperty: 'id'
      });

      var saveAction = new Save({
         columns: [{
            title: 'Name',
            field: 'name'
         }]
      });
      saveAction.setSaveStrategy(new fakeStrategy());

      describe('SBIS3.CONTROLS/Action/Save', function () {
         describe('RecordSet in meta', function () {
            before(function() {
               saveAction.execute({
                  columns: [{
                     title: 'Id',
                     field: 'id'
                  }, {
                     title: 'Name',
                     field: 'name'
                  }],
                  endpoint: 'FileType',
                  fileName: 'MyFileName',
                  recordSet: recordSet
               });
            });
            it('Check fileName', function () {
               assert.equal(lastArgs.cfg.FileName, 'MyFileName');
            });
            it('Check methodName', function () {
               assert.equal(lastArgs.methodName, 'SaveRecordSet');
            });
            it('Check columns', function () {
               assert.deepEqual(lastArgs.cfg.Fields, ['id', 'name']);
               assert.deepEqual(lastArgs.cfg.Titles, ['Id', 'Name']);
            });
            it('Check recordSet', function () {
               assert.isTrue(lastArgs.cfg.Data.isEqual(recordSet));
            });
         });

         describe('Query in meta (without load data on client))', function () {
            before(function() {
               var query = new Query();
               saveAction.execute({
                  endpoint: 'FileType',
                  fileName: 'MyFileName',
                  query: query,
                  dataSource: new SbisService({
                     endpoint: 'MyEndpoint',
                     binding: {
                        query: 'MyQueryMethod'
                     }
                  })
               });
            });
            it('Check methodName', function () {
               assert.equal(lastArgs.methodName, 'SaveList');
            });

            it('Check queryMethodName', function () {
               assert.equal(lastArgs.cfg.MethodName, 'MyEndpoint.MyQueryMethod');
            });
         });
         describe('showColumnsEditor', function () {
            it('return Deferred fail', function () {
               saveAction.sendCommand = function(commandName) {
                  if (commandName === 'showColumnsEditor') {
                     return Deferred.fail();
                  }
               };

               saveAction.execute({
                  columns: [{
                     title: 'Id',
                     field: 'id'
                  }],
                  endpoint: 'FileType',
                  recordSet: recordSet
               });

               assert.deepEqual(lastArgs.cfg.Titles, ['Id']);
               assert.deepEqual(lastArgs.cfg.Fields, ['id']);
            });
            it('return columns', function () {
               saveAction.sendCommand = function(commandName) {
                  if (commandName === 'showColumnsEditor') {
                     return Deferred.success({
                        resultColumns: [{
                           title: 'Name',
                           field: 'name'
                        }]
                     });
                  }
               };

               saveAction.execute({
                  columns: [{
                     title: 'Id',
                     field: 'id'
                  }],
                  endpoint: 'FileType',
                  recordSet: recordSet
               });

               assert.deepEqual(lastArgs.cfg.Titles, ['Name']);
               assert.deepEqual(lastArgs.cfg.Fields, ['name']);
            });
         });
      });
});