define(['js!SBIS3.CONTROLS.FilterPanelChooser.DetailsList', 'js!WS.Data/Collection/RecordSet'], function (DetailsList, RecordSet) {

   'use strict';

   describe('SBIS3.CONTROLS.FilterPanelChooser.DetailsList', function () {
      var
         imitateEvent = {
            setResult: function() {}
         },
         testComponent,
         testResult1 = [],
         testResult2 = [{id: 1, hierarchy: false}],
         testResult3 = [{id: 1, hierarchy: false}, {id: 2, hierarchy: true}],
         testResult4 = [{id: 2, hierarchy: true}],
         testResult5 = [{id: 1, hierarchy: false}, {id: 2, hierarchy: true}],
         testResult6 = [{id: 2, hierarchy: true}, {id: 1, hierarchy: false}],
         testResult7 = [{id: 1, hierarchy: false}, {id: 2, hierarchy: true}];

      beforeEach(function() {
         if (typeof window !== 'undefined') {
            testComponent = new DetailsList({
               element: $('<div class="TestDetailsList"></div>').appendTo($('body')),
               properties: {
                  idProperty: 'id',
                  displayProperty: 'title',
                  items: new RecordSet({
                     rawData: [
                        { id: 1, 'title': 'Номенклатура', hierarchy: false },
                        { id: 2, 'title': 'Ответственный', hierarchy: true },
                        { id: 3, 'title': 'Покупатель', hierarchy: null },
                        { id: 4, 'title': 'Склад', hierarchy: false }
                     ],
                     idProperty: 'id'
                  })
               }
            });
         } else {
            this.skip();
         }
      });

      afterEach(function() {
         if (typeof window !== 'undefined') {
            testComponent.destroy();
            testComponent = undefined;
         } else {
            this.skip();
         }
      });

      describe('Check initialize component', function () {
         if (typeof window !== 'undefined') {
            it('First check load component | value = []', function () {
               assert.deepEqual(testComponent.getValue(), testResult1);
            });
         }
      });
      describe('Check selecting items', function () {
         if (typeof window !== 'undefined') {
            it('Select item "1" | value = [1]', function () {
               testComponent._elemClickHandler(imitateEvent, '1');
               assert.deepEqual(testComponent.getValue(), testResult2);
            });
            it('Select item "2" | value = [1, 2]', function () {
               testComponent._elemClickHandler(imitateEvent, '1');
               testComponent._elemClickHandler(imitateEvent, '2');
               assert.deepEqual(testComponent.getValue(), testResult3);
            });
            it('Unselect "1"  | value = [2]', function () {
               testComponent._elemClickHandler(imitateEvent, '1');
               testComponent._elemClickHandler(imitateEvent, '2');
               testComponent._elemClickHandler(imitateEvent, '1');
               assert.deepEqual(testComponent.getValue(), testResult4);
            });
            it('Select item "1" | value = [1, 2]', function () {
               testComponent._elemClickHandler(imitateEvent, '1');
               testComponent._elemClickHandler(imitateEvent, '2');
               testComponent._elemClickHandler(imitateEvent, '1');
               testComponent._elemClickHandler(imitateEvent, '1');
               assert.deepEqual(testComponent.getValue(), testResult5);
            });
            it('Move up item "2" | value = [2, 1]', function () {
               testComponent._elemClickHandler(imitateEvent, '1');
               testComponent._elemClickHandler(imitateEvent, '2');
               testComponent._elemClickHandler(imitateEvent, '1');
               testComponent._elemClickHandler(imitateEvent, '1');
               testComponent._itemsMoveController.moveItem(testComponent._listView.getItems().getRecordById('2'), 'before');
               assert.deepEqual(testComponent.getValue(), testResult6);
            });
            it('Move down item "2" | value = [1, 2]', function () {
               testComponent._elemClickHandler(imitateEvent, '1');
               testComponent._elemClickHandler(imitateEvent, '2');
               testComponent._elemClickHandler(imitateEvent, '1');
               testComponent._elemClickHandler(imitateEvent, '1');
               testComponent._itemsMoveController.moveItem(testComponent._listView.getItems().getRecordById('2'), 'before');
               testComponent._itemsMoveController.moveItem(testComponent._listView.getItems().getRecordById('2'), 'after');
               assert.deepEqual(testComponent.getValue(), testResult7);
            });
         }
      });
   });
});